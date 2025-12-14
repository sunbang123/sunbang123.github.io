const GITHUB_USERNAME = 'sunbang123';

// 1. DATA FETCHING
async function fetchGitHubData() {
    try {
        const [commits, issues, releases] = await Promise.all([
            fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io/main/_data/commits_data.json`).then(r => r.json()),
            fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io/main/_data/issues_data.json`).then(r => r.json()),
            fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io/main/_data/releases_data.json`).then(r => r.json())
        ]);

        return { 
            commitsData: commits.filter(i => i.type), 
            issuesData: issues.filter(i => i.type), 
            releasesData: releases.filter(i => i.type)
        };
    } catch (e) {
        console.error('Error:', e);
        return null;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const diff = (new Date() - date) / (1000 * 60 * 60 * 24);
    if (diff < 1) return '오늘';
    if (diff < 7) return `${Math.floor(diff)}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

// 2. RENDERING FUNCTIONS
function renderCommits(commits) {
    if (!commits.length) return '<div class="no-data">데이터 없음</div>';
    return commits.map(c => `
        <div class="activity-item-wrapper">
            <a href="https://github.com/${GITHUB_USERNAME}/${c.repo}/commit/${c.sha}" target="_blank" style="text-decoration: none; color: inherit; width: 100%;">
                <div class="activity-item">
                    <div class="item-header">
                        <span class="item-title">${c.message.split('\n')[0]}</span>
                        <span class="item-badge badge-commit">Commit</span>
                    </div>
                    <div class="item-meta">
                        <span class="repo-name">${c.repo}</span>
                        <span>${formatDate(c.date)}</span>
                    </div>
                </div>
            </a>
        </div>`).join('');
}

function renderIssues(issues) {
    if (!issues.length) return '<div class="no-data">데이터 없음</div>';
    return issues.map(i => `
        <div class="activity-item-wrapper">
            <a href="${i.url}" target="_blank" style="text-decoration: none; color: inherit; width: 100%;">
                <div class="activity-item">
                    <div class="item-header">
                        <span class="item-title">${i.title}</span>
                        <span class="item-badge ${i.type === 'pull_request' ? 'badge-pr' : 'badge-issue'}">${i.state}</span>
                    </div>
                    <div class="item-meta">
                        <span class="repo-name">${i.repo}</span>
                        <span>#${i.number}</span>
                        <span>${formatDate(i.date)}</span>
                    </div>
                </div>
            </a>
        </div>`).join('');
}

function renderReleases(releases) {
    if (!releases.length) return '<div class="no-data">데이터 없음</div>';
    return releases.map(r => `
        <div class="activity-item-wrapper">
            <a href="${r.url}" target="_blank" style="text-decoration: none; color: inherit; width: 100%;">
                <div class="activity-item">
                    <div class="item-header">
                        <span class="item-title">${r.name || r.tag}</span>
                        <span class="item-badge badge-release">Release</span>
                    </div>
                    <div class="item-meta">
                        <span class="repo-name">${r.repo}</span>
                        <span>${r.tag}</span>
                        <span>${formatDate(r.date)}</span>
                    </div>
                </div>
            </a>
        </div>`).join('');
}

// 3. SLIDER LOGIC
function setupHorizontalSlider(trackId, prevBtnId, nextBtnId, totalItems) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    let currentIndex = 0;

    function getVisibleCount() {
        const w = window.innerWidth;
        return w < 768 ? 1 : (w < 992 ? 2 : 3);
    }

    function update() {
        const visible = getVisibleCount();
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalItems - visible;
        prevBtn.classList.toggle('disabled', prevBtn.disabled);
        nextBtn.classList.toggle('disabled', nextBtn.disabled);

        const slideWidth = track.children[0] ? track.children[0].offsetWidth : 0;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    prevBtn.addEventListener('click', () => { if(currentIndex > 0) { currentIndex--; update(); }});
    nextBtn.addEventListener('click', () => { if(currentIndex < totalItems - getVisibleCount()) { currentIndex++; update(); }});
    window.addEventListener('resize', update);
    setTimeout(update, 100);
}

function setupVerticalSlider(trackId, prevBtnId, nextBtnId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    let currentIndex = 0;
    const totalItems = track.children.length;
    const itemHeight = 100; 

    function update() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalItems - 1;
        prevBtn.classList.toggle('disabled', prevBtn.disabled);
        nextBtn.classList.toggle('disabled', nextBtn.disabled);
        track.style.transform = `translateY(-${currentIndex * itemHeight}px)`;
    }

    prevBtn.addEventListener('click', () => { if(currentIndex > 0) { currentIndex--; update(); }});
    nextBtn.addEventListener('click', () => { if(currentIndex < totalItems - 1) { currentIndex++; update(); }});
    setTimeout(update, 100);
}

// 4. INIT
async function init() {
    const projectContainer = document.getElementById('projects-slider-container');
    const totalProjects = projectContainer ? parseInt(projectContainer.getAttribute('data-total'), 10) : 0;
    setupHorizontalSlider('projects-slider-track', 'projects-prev-btn', 'projects-next-btn', totalProjects);

    const container = document.getElementById('activities-container');
    const data = await fetchGitHubData();
    
    if (!data) {
        container.innerHTML = '<div class="no-data">로드 실패</div>';
        return;
    }

    const createSection = (title, iconClass, iconColor, count, trackId, htmlContent, prevId, nextId) => `
        <div class="activity-section">
            <div class="section-header">
                <div class="header-left">
                    <i class="${iconClass} section-icon ${iconColor}"></i>
                    <span class="section-title">${title} <span class="count-badge">${count}</span></span>
                </div>
                <div class="slider-nav">
                    <button class="slider-btn" id="${prevId}"><i class="bi bi-chevron-up"></i></button>
                    <button class="slider-btn" id="${nextId}"><i class="bi bi-chevron-down"></i></button>
                </div>
            </div>
            <div class="slider-container vertical-container">
                <div class="slider-track vertical-track" id="${trackId}">
                    ${htmlContent}
                </div>
            </div>
        </div>`;

    // 아이콘을 Bootstrap Icon으로 변경
    container.innerHTML = 
        createSection('Releases', 'bi bi-box-seam', 'text-warning', data.releasesData.length, 'releases-track', renderReleases(data.releasesData), 'releases-up', 'releases-down') +
        createSection('Recent Commits', 'bi bi-git', 'text-info', data.commitsData.length, 'commits-track', renderCommits(data.commitsData), 'commits-up', 'commits-down') +
        createSection('Issues & PRs', 'bi bi-exclamation-circle', 'text-success', data.issuesData.length, 'issues-track', renderIssues(data.issuesData), 'issues-up', 'issues-down');

    setupVerticalSlider('releases-track', 'releases-up', 'releases-down');
    setupVerticalSlider('commits-track', 'commits-up', 'commits-down');
    setupVerticalSlider('issues-track', 'issues-up', 'issues-down');
    
    const addLink = document.getElementById('add-project-link');
    if(addLink) {
        addLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://github.com/sunbang123?tab=repositories', '_blank');
        });
    }
}

init();