function initReadPage() {
    const list = document.getElementById('readPostList');
    if (!list) return;

    const params = new URLSearchParams(window.location.search);
    const selectedTag = params.get('tag');
    const selectedSeries = params.get('series');
    const cards = Array.from(list.querySelectorAll('.read-post-card'));
    const title = document.getElementById('readResultTitle');
    const count = document.getElementById('readResultCount');
    const empty = document.getElementById('readEmpty');
    const buttons = Array.from(document.querySelectorAll('[data-tag-button]'));
    const seriesButtons = Array.from(document.querySelectorAll('[data-series-button]'));
    const activeSeriesButton = seriesButtons.find((button) => button.dataset.seriesButton === selectedSeries);
    const activeSeriesTags = activeSeriesButton
        ? (activeSeriesButton.dataset.seriesTags || '').split('||').filter(Boolean)
        : [];

    let visibleCount = 0;

    cards.forEach((card) => {
        const tags = (card.dataset.tags || '').split('||').filter(Boolean);
        const matchesTag = !selectedTag || tags.includes(selectedTag);
        const matchesSeries = !selectedSeries || activeSeriesTags.some((tag) => tags.includes(tag));
        const visible = matchesTag && matchesSeries;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
    });

    buttons.forEach((button) => {
        const tag = button.dataset.tagButton;
        button.classList.toggle('is-active', (!selectedTag && !selectedSeries && tag === 'all') || tag === selectedTag);
    });

    seriesButtons.forEach((button) => {
        const series = button.dataset.seriesButton;
        button.classList.toggle('is-active', (!selectedTag && !selectedSeries && series === 'all') || series === selectedSeries);
    });

    if (selectedTag) {
        title.textContent = `#${selectedTag}`;
    } else if (activeSeriesButton) {
        title.textContent = `${activeSeriesButton.dataset.seriesName || activeSeriesButton.textContent.trim()} 시리즈`;
    } else {
        title.textContent = '전체 글';
    }

    count.textContent = `${visibleCount}개 글`;
    empty.hidden = visibleCount !== 0;
}

initReadPage();
