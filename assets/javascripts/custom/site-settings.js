const siteSettings = {
    theme: localStorage.getItem('site-theme') || 'dark',
    font: localStorage.getItem('site-font') || 'base',
    width: localStorage.getItem('site-width') || 'normal'
};

function applySiteSettings() {
    document.documentElement.dataset.theme = siteSettings.theme;
    document.body.dataset.font = siteSettings.font;
    document.body.dataset.width = siteSettings.width;

    document.querySelectorAll('[data-setting]').forEach((button) => {
        const setting = button.dataset.setting;
        button.classList.toggle('is-active', button.dataset.value === siteSettings[setting]);
    });
}

document.querySelectorAll('[data-setting]').forEach((button) => {
    button.addEventListener('click', () => {
        const setting = button.dataset.setting;
        const value = button.dataset.value;
        siteSettings[setting] = value;
        localStorage.setItem(`site-${setting}`, value);
        applySiteSettings();
    });
});

applySiteSettings();
