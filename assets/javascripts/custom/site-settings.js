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
    if (!input || !results) return;

    const indexUrl = results.dataset.searchIndexUrl || '/search.json';
    let searchItemsPromise;

    const loadSearchItems = () => {
        if (!searchItemsPromise) {
            searchItemsPromise = fetch(indexUrl, { credentials: 'same-origin' })
                .then((response) => {
                    if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
                    return response.json();
                })
                .then((items) => items.map((item) => ({
                    ...item,
                    haystack: `${item.title || ''} ${item.text || ''}`.toLowerCase()
                })));
        }

        return searchItemsPromise;
    };

    const renderMatches = (matches) => {
        if (matches.length === 0) {
            results.innerHTML = '<p>검색 결과가 없습니다.</p>';
            return;
        }

        const links = matches.map((item) => {
            const link = document.createElement('a');
            const type = document.createElement('span');
            const title = document.createElement('strong');

            link.href = item.url;
            type.textContent = item.type || 'Page';
            title.textContent = item.title || '제목 없음';
            link.append(type, title);

            return link;
        });

        results.replaceChildren(...links);
    };

    input.addEventListener('input', async () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
            results.innerHTML = '<p>검색어를 입력하면 관련 항목이 표시됩니다.</p>';
            return;
        }

        results.innerHTML = '<p>검색 중입니다.</p>';

        try {
            const items = await loadSearchItems();
            if (input.value.trim().toLowerCase() !== query) return;
            renderMatches(items.filter((item) => item.haystack.includes(query)).slice(0, 8));
        } catch (error) {
            console.error(error);
            results.innerHTML = '<p>검색 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>';
        }
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
