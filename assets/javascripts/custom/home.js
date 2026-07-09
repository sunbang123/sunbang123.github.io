const particlesContainer = document.getElementById('particles');

if (particlesContainer) {
    for (let i = 0; i < 24; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 8 + 4}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 12}s`;
        particle.style.animationDuration = `${Math.random() * 8 + 12}s`;
        particlesContainer.appendChild(particle);
    }
}

function initMomontonGate() {
    const gate = document.querySelector('[data-momonton-gate]');
    if (!gate) return;

    let clicks = 0;
    let isOpening = false;
    const targetUrl = '/momonton/';

    function pulseGate() {
        gate.classList.remove('is-charged');
        void gate.offsetWidth;
        gate.classList.add('is-charged');
    }

    function openGate() {
        isOpening = true;
        const rect = gate.getBoundingClientRect();
        const launch = document.createElement('div');
        const appSurface = document.createElement('div');
        const appMark = document.createElement('span');

        launch.className = 'momonton-app-launch';
        appSurface.className = 'momonton-app-launch__surface';
        appMark.className = 'momonton-app-launch__mark';
        appMark.dataset.face = ';)';
        appMark.setAttribute('aria-hidden', 'true');

        launch.style.setProperty('--launch-left', `${rect.left}px`);
        launch.style.setProperty('--launch-top', `${rect.top}px`);
        launch.style.setProperty('--launch-width', `${rect.width}px`);
        launch.style.setProperty('--launch-height', `${rect.height}px`);

        appSurface.appendChild(appMark);
        launch.appendChild(appSurface);
        document.body.appendChild(launch);

        gate.dataset.face = ';)';
        gate.classList.add('is-opening');

        window.setTimeout(() => {
            window.location.href = targetUrl;
        }, 760);
    }

    gate.addEventListener('click', () => {
        if (isOpening) return;

        clicks += 1;
        gate.dataset.clicks = clicks;

        if (clicks >= 3) {
            openGate();
            return;
        }

        gate.dataset.face = clicks === 1 ? ':0' : ':D';
        pulseGate();
    });
}

initMomontonGate();

async function loadActivities() {
    const container = document.getElementById('commitsContainer');
    if (!container) return;

    const githubUsername = 'sunbang123';
    const files = [
        { type: 'commit', path: '/_data/commits_data.json' },
        { type: 'issue', path: '/_data/issues_data.json' },
        { type: 'release', path: '/_data/releases_data.json' }
    ];

    try {
        const results = await Promise.all(files.map(async (file) => {
            try {
                const response = await fetch(file.path);
                if (!response.ok) return [];
                const data = await response.json();
                return data
                    .filter((item) => item.repo !== undefined)
                    .map((item) => ({ ...item, dataType: file.type }));
            } catch (error) {
                console.warn(`${file.path} load failed`, error);
                return [];
            }
        }));

        const activities = results
            .flat()
            .map((item) => {
                const date = new Date(item.date);
                const isPullRequest = item.type === 'pull_request';

                if (item.dataType === 'commit') {
                    return {
                        date,
                        repo: item.repo,
                        title: item.message.split('\n')[0],
                        url: `https://github.com/${githubUsername}/${item.repo}/commit/${item.sha}`,
                        meta: item.sha.substring(0, 7),
                        badge: 'Commit'
                    };
                }

                if (item.dataType === 'issue') {
                    return {
                        date,
                        repo: item.repo,
                        title: item.title,
                        url: item.url,
                        meta: `#${item.number}`,
                        badge: isPullRequest ? 'PR' : 'Issue'
                    };
                }

                return {
                    date,
                    repo: item.repo,
                    title: item.name || item.tag,
                    url: item.url,
                    meta: item.tag,
                    badge: 'Release'
                };
            })
            .sort((a, b) => b.date - a.date)
            .slice(0, 8);

        if (activities.length === 0) {
            container.innerHTML = '<p class="empty-message">최근 활동 데이터가 없습니다.</p>';
            return;
        }

        container.innerHTML = activities.map((item) => {
            const date = item.date.toLocaleDateString('ko-KR');
            return `
                <article class="commit-item">
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                        <span class="commit-badge">${item.badge}</span>
                        <strong>${item.title}</strong>
                    </a>
                    <div class="commit-meta">
                        <span>${item.repo}</span>
                        <span>${date}</span>
                        <span class="commit-sha">${item.meta}</span>
                    </div>
                </article>
            `;
        }).join('');
    } catch (error) {
        container.innerHTML = `<p class="error-message">활동 정보를 불러오지 못했습니다: ${error.message}</p>`;
    }
}

loadActivities();
