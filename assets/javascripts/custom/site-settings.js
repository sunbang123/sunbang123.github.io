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

function initSettingsSearch() {
    const input = document.getElementById('settingsSearchInput');
    const results = document.getElementById('settingsSearchResults');
    const items = Array.from(document.querySelectorAll('[data-search-item]'));
    if (!input || !results || items.length === 0) return;

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
            results.innerHTML = '<p>검색어를 입력하면 관련 항목이 표시됩니다.</p>';
            return;
        }

        const matches = items
            .map((item) => ({
                href: item.getAttribute('href'),
                title: item.dataset.title || item.textContent.trim(),
                type: item.dataset.type || 'Page',
                haystack: `${item.dataset.title || ''} ${item.dataset.text || ''}`.toLowerCase()
            }))
            .filter((item) => item.haystack.includes(query))
            .slice(0, 8);

        if (matches.length === 0) {
            results.innerHTML = '<p>검색 결과가 없습니다.</p>';
            return;
        }

        results.innerHTML = matches.map((item) => `
            <a href="${item.href}">
                <span>${item.type}</span>
                <strong>${item.title}</strong>
            </a>
        `).join('');
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
initSettingsSearch();
