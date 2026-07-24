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
    const tagButtons = Array.from(document.querySelectorAll('[data-tag-button]'));
    const seriesButtons = Array.from(document.querySelectorAll('[data-series-button]'));
    const picker = document.getElementById('readPicker');
    const pickerDialog = picker ? picker.querySelector('.series-picker__dialog') : null;
    const pickerKicker = document.getElementById('readPickerKicker');
    const pickerTitle = document.getElementById('readPickerTitle');
    const pickerCount = document.getElementById('readPickerCount');
    const pickerPosts = document.getElementById('readPickerPosts');
    const pickerEmpty = document.getElementById('readPickerEmpty');
    const pickerSearch = document.querySelector('[data-read-picker-search]');
    const pickerCloseButtons = Array.from(document.querySelectorAll('[data-read-picker-close]'));
    const activeSeriesButton = seriesButtons.find((button) => button.dataset.seriesButton === selectedSeries);
    let currentPickerCards = [];
    let currentEmptyMessage = '연결된 글이 아직 없습니다.';

    const getCardTags = (card) => (card.dataset.tags || '').split('||').filter(Boolean);
    const getSeriesTags = (button) => (button.dataset.seriesTags || '').split('||').filter(Boolean);
    const getCardSearchText = (card) => {
        const link = card.querySelector('h3 a');
        const excerpt = card.querySelector('p');
        return [
            link ? link.textContent : '',
            excerpt ? excerpt.textContent : '',
            getCardTags(card).join(' ')
        ].join(' ').toLowerCase();
    };

    const renderPickerPost = (card) => {
        const link = card.querySelector('h3 a');
        const time = card.querySelector('time');
        const excerpt = card.querySelector('p');
        const tags = Array.from(card.querySelectorAll('.read-post-card__tags a'));
        const item = document.createElement('a');
        const date = document.createElement('span');
        const heading = document.createElement('strong');
        const summary = document.createElement('span');
        const tagList = document.createElement('span');

        item.className = 'series-picker__post';
        item.href = link ? link.href : '#';

        date.className = 'series-picker__date';
        date.textContent = time ? time.textContent : '';

        heading.textContent = link ? link.textContent : '제목 없음';

        summary.className = 'series-picker__excerpt';
        summary.textContent = excerpt ? excerpt.textContent : '';

        tagList.className = 'series-picker__tags';
        tags.slice(0, 5).forEach((tag) => {
            const tagItem = document.createElement('span');
            tagItem.textContent = tag.textContent;
            tagList.appendChild(tagItem);
        });

        item.append(date, heading, summary, tagList);

        return item;
    };

    const setActiveChoice = ({ tag, series }) => {
        tagButtons.forEach((button) => {
            const buttonTag = button.dataset.tagButton;
            button.classList.toggle('is-active', tag === buttonTag || (!tag && !series && buttonTag === 'all'));
        });

        seriesButtons.forEach((button) => {
            const buttonSeries = button.dataset.seriesButton;
            button.classList.toggle('is-active', series === buttonSeries || (!tag && !series && buttonSeries === 'all'));
        });
    };

    const closePicker = () => {
        if (!picker) return;
        picker.classList.remove('is-open');
        picker.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('series-picker-open');
    };

    const renderPickerResults = () => {
        if (!pickerPosts || !pickerCount || !pickerEmpty) return;

        const searchTerm = pickerSearch ? pickerSearch.value.trim().toLowerCase() : '';
        const filteredCards = searchTerm
            ? currentPickerCards.filter((card) => getCardSearchText(card).includes(searchTerm))
            : currentPickerCards;

        pickerCount.textContent = searchTerm
            ? `${filteredCards.length}개 글 / ${currentPickerCards.length}개`
            : `${currentPickerCards.length}개 글`;
        pickerPosts.replaceChildren(...filteredCards.map(renderPickerPost));
        pickerEmpty.textContent = searchTerm && currentPickerCards.length
            ? '검색어와 맞는 글이 없습니다.'
            : currentEmptyMessage;
        pickerEmpty.hidden = filteredCards.length !== 0;
    };

    const openPicker = ({ heading, kicker, cardsToShow, emptyMessage, tag, series }) => {
        if (!picker || !pickerPosts || !pickerTitle || !pickerCount || !pickerEmpty) return;

        pickerKicker.textContent = kicker;
        pickerTitle.textContent = heading;
        currentPickerCards = cardsToShow;
        currentEmptyMessage = emptyMessage;
        if (pickerSearch) pickerSearch.value = '';
        renderPickerResults();
        picker.classList.add('is-open');
        picker.setAttribute('aria-hidden', 'false');
        document.body.classList.add('series-picker-open');
        setActiveChoice({ tag, series });

        if (pickerDialog) {
            pickerDialog.focus();
        }
    };

    const openAllPosts = () => {
        openPicker({
            heading: '전체 글',
            kicker: 'All Posts',
            cardsToShow: cards,
            emptyMessage: '아직 등록된 글이 없습니다.',
            tag: null,
            series: null
        });
    };

    const openTagPicker = (tag) => {
        const cardsToShow = tag === 'all'
            ? cards
            : cards.filter((card) => getCardTags(card).includes(tag));

        openPicker({
            heading: tag === 'all' ? '전체 글' : `#${tag}`,
            kicker: 'Read By Tag',
            cardsToShow,
            emptyMessage: '선택한 태그와 연결된 글이 아직 없습니다.',
            tag: tag === 'all' ? null : tag,
            series: null
        });
    };

    const openSeriesPicker = (button) => {
        const seriesTags = getSeriesTags(button);
        const cardsToShow = cards.filter((card) => {
            const tags = getCardTags(card);
            return seriesTags.some((tag) => tags.includes(tag));
        });

        openPicker({
            heading: `${button.dataset.seriesName || button.textContent.trim()} 시리즈`,
            kicker: 'Series Shelf',
            cardsToShow,
            emptyMessage: '이 시리즈에 연결된 글이 아직 없습니다.',
            tag: null,
            series: button.dataset.seriesButton
        });
    };

    cards.forEach((card) => {
        card.hidden = false;
    });

    if (title) title.textContent = '전체 글';
    if (count) count.textContent = `${cards.length}개 글`;
    if (empty) empty.hidden = true;
    setActiveChoice({ tag: null, series: null });

    tagButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            openTagPicker(button.dataset.tagButton);
        });
    });

    seriesButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            if (button.dataset.seriesButton === 'all') {
                openAllPosts();
                return;
            }

            openSeriesPicker(button);
        });
    });

    pickerCloseButtons.forEach((button) => {
        button.addEventListener('click', closePicker);
    });

    if (pickerSearch) {
        pickerSearch.addEventListener('input', renderPickerResults);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closePicker();
    });

    if (selectedTag) {
        openTagPicker(selectedTag);
    } else if (activeSeriesButton && activeSeriesButton.dataset.seriesButton !== 'all') {
        openSeriesPicker(activeSeriesButton);
    }
}

initReadPage();
