(function() {
    // Vérifier si le thème sombre est activé dans le stockage local
    try {
        browser.storage.local.get('darkMode').then(data => {
            if (data.darkMode) {
                document.documentElement.classList.add('preload');
                document.body.classList.add('dark-theme');
                // Retirer la classe preload après un court délai
                setTimeout(() => {
                    document.documentElement.classList.remove('preload');
                }, 50);
            }
        }).catch(() => {});
    } catch (e) {}
})();
