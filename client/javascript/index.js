function generateUUID() { 
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function initializeSession() {
    // Obtener UUID de sessionStorage en lugar de localStorage
    let uuid = sessionStorage.getItem('userUUID');

    if (!uuid) {
        uuid = generateUUID();
        sessionStorage.setItem('userUUID', uuid);
    }

    return uuid;
}

function updateURLWithUUID(uuid) {
    const currentURL = new URL(window.location.href);
    currentURL.searchParams.set('userUUID', uuid);
    window.history.replaceState({}, '', currentURL);
}

document.addEventListener('DOMContentLoaded', () => {
    const userUUID = initializeSession();

    updateURLWithUUID(userUUID);
});

function showLoading(categoria) {
    const userUUID = sessionStorage.getItem('userUUID');  // Obtener de sessionStorage
    const categoriaNormalizada = categoria.replace(/_/g, ' ').toLowerCase();

    document.getElementById('loading').classList.remove('hidden');

    setTimeout(() => {
        window.location.href = `questions.html?categoria=${categoriaNormalizada}&userUUID=${userUUID}`;
    }, 2000);
}
