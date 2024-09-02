const pool = require('../config/db.js');

const obtenerPregunta = async (req, res) => {
    const categoria = req.query.categoria;
    const userUUID = req.query.userUUID;

    const query = `
        SELECT p.id AS pregunta_id, p.pregunta, r.respuesta, r.correcta
        FROM preguntas p
        JOIN categoria c ON p.categoria_id = c.id
        JOIN respuestas r ON p.id = r.pregunta_id
        WHERE c.nombre LIKE ? 
        ORDER BY RAND()
    `;

    try {
        const [results] = await pool.query(query, [`%${categoria}%`]);

        if (results.length > 0) {
            const pregunta = results[0].pregunta;
            const preguntaId = results[0].pregunta_id;

            // Filtrar respuestas correctas e incorrectas
            const respuestasCorrectas = results.filter(r => r.correcta === 1).map(r => r.respuesta);
            const respuestasIncorrectas = results.filter(r => r.correcta === 0).map(r => r.respuesta);

            // Seleccionar tres respuestas incorrectas al azar
            const respuestasAleatorias = respuestasIncorrectas.sort(() => 0.5 - Math.random()).slice(0, 3);
            respuestasAleatorias.push(respuestasCorrectas[0]); // Añadir la respuesta correcta

            // Mezclar las respuestas para que no siempre aparezca la correcta en la misma posición
            const respuestasFinales = respuestasAleatorias.sort(() => 0.5 - Math.random());

            // Enviar la respuesta con la pregunta, respuestas y la correcta
            res.json({ 
                pregunta, 
                respuestas: respuestasFinales, 
                preguntaId, 
                correcta: respuestasCorrectas[0] // Devolver la respuesta correcta para manejarla en el frontend
            });
        } else {
            res.json({ pregunta: 'No se encontró una pregunta para esta categoría.' });
        }
    } catch (err) {
        console.error('Error al obtener la pregunta:', err);
        res.status(500).json({ error: 'Error al obtener la pregunta' });
    }
};

const registrarRespuesta = async (req, res) => {
    const { userUUID, preguntaId, respuestaCorrecta } = req.body;

    const query = 'INSERT INTO auditoria (usuario_id, pregunta_id) VALUES (?, ?)';

    try {
        await pool.query(query, [userUUID, preguntaId]);
        res.json({ mensaje: respuestaCorrecta ? 'Respuesta correcta' : 'Respuesta incorrecta' });
    } catch (err) {
        console.error('Error al registrar en auditoría:', err);
        res.status(500).json({ error: 'Error al registrar la respuesta en auditoría' });
    }
};

module.exports = { obtenerPregunta, registrarRespuesta };
