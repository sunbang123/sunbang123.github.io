(function () {
    const backButton = document.querySelector('[data-page-back]');
    const topButton = document.querySelector('[data-page-top]');

    if (backButton) {
        backButton.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
                return;
            }

            window.location.href = '/';
        });
    }

    if (topButton) {
        topButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
})();
