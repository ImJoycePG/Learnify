document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get('categoria');
    const userUUID = params.get('userUUID');
    const categoriaTitle = document.getElementById('categoria-title');
    const preguntaText = document.getElementById('pregunta-text');
    const respuestasContainer = document.getElementById('respuestas-container');

    const correctSound = new Audio('assets/correct.mp3');
    const incorrectSound = new Audio('assets/incorrect.mp3');

    categoriaTitle.textContent = `Pregunta de ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;

    // Solicitar la pregunta y respuestas a la API
    fetch(`https://learnify-8k73.onrender.com//api/obtenerPregunta?categoria=${categoria}&userUUID=${userUUID}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            preguntaText.textContent = data.pregunta;

            respuestasContainer.innerHTML = '';

            data.respuestas.forEach(respuesta => {
                const card = document.createElement('div');
                card.className = "bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer";
                card.textContent = respuesta;
                card.onclick = () => handleAnswer(card, respuesta, data.preguntaId, data.correcta);
                respuestasContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al cargar la pregunta:', error);
            preguntaText.textContent = 'No se pudo cargar la pregunta. Intenta nuevamente.';
        });

    function handleAnswer(card, respuestaSeleccionada, preguntaId, respuestaCorrecta) {
        if (respuestaSeleccionada === respuestaCorrecta) {
            card.classList.remove('bg-blue-500');
            card.classList.add('bg-green-500');
            correctSound.play();
        } else {
            card.classList.remove('bg-blue-500');
            card.classList.add('bg-red-500');
            incorrectSound.play();
        }

        const allCards = document.querySelectorAll('#respuestas-container div');
        allCards.forEach(c => c.onclick = null);

        setTimeout(() => {
            fetch('https://learnify-8k73.onrender.com//api/registrarRespuesta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userUUID,
                    preguntaId,
                    respuestaCorrecta: respuestaSeleccionada === respuestaCorrecta
                })
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = `index.html?userUUID=${userUUID}`;
            })
            .catch(error => {
                console.error('Error al registrar la respuesta:', error);
            });
        }, 3000);
    }
});
