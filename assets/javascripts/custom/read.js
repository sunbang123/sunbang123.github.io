function initReadPage() {
    const list = document.getElementById('readPostList');
    if (!list) return;

    const params = new URLSearchParams(window.location.search);
    const selectedTag = params.get('tag');
    const cards = Array.from(list.querySelectorAll('.read-post-card'));
    const title = document.getElementById('readResultTitle');
    const count = document.getElementById('readResultCount');
    const empty = document.getElementById('readEmpty');
    const buttons = Array.from(document.querySelectorAll('[data-tag-button]'));

    let visibleCount = 0;

    cards.forEach((card) => {
        const tags = (card.dataset.tags || '').split('||').filter(Boolean);
        const visible = !selectedTag || tags.includes(selectedTag);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
    });

    buttons.forEach((button) => {
        const tag = button.dataset.tagButton;
        button.classList.toggle('is-active', (!selectedTag && tag === 'all') || tag === selectedTag);
    });

    title.textContent = selectedTag ? `#${selectedTag}` : '전체 글';
    count.textContent = `${visibleCount}개 글`;
    empty.hidden = visibleCount !== 0;
}

initReadPage();
