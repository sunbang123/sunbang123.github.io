
// 파티클 생성
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = Math.random() * 10 + 5 + 'px';
    particle.style.height = particle.style.width;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = Math.random() * 10 + 10 + 's';
    particlesContainer.appendChild(particle);
}

// 스파크 효과 추가
const heroSection = document.querySelector('.hero-section');
setInterval(() => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    heroSection.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 2000);
}, 1000);

// Parallax 효과
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) / 50;
    const moveY = (e.clientY - window.innerHeight / 2) / 50;
    
    document.querySelector('.diagonal-bg').style.transform = 
        `translate(${moveX}px, ${moveY}px)`;
});

// 스크롤 시 스크롤 인디케이터 숨김
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';
    }
});

// ========== 게임 효과 시스템 (Total Score/Combo 배경화 적용) ==========
let totalScore = 0;
let comboCount = 0;
let comboTimer = null;

const backgroundScoreOverlay = document.getElementById('backgroundScoreOverlay');

// 1. 배경 총 점수 표시 생성 및 초기화
const backgroundTotalScoreDisplay = document.createElement('div');
backgroundTotalScoreDisplay.className = 'background-total-score';
backgroundTotalScoreDisplay.textContent = '0';
backgroundScoreOverlay.appendChild(backgroundTotalScoreDisplay);

// 2. 배경 콤보 표시 생성 (초기에는 숨김)
const backgroundComboDisplay = document.createElement('div');
backgroundComboDisplay.className = 'background-combo-display';
backgroundComboDisplay.style.display = 'none'; // 초기 숨김
backgroundScoreOverlay.appendChild(backgroundComboDisplay);


// 이모지별 효과 설정
const emojiEffects = {
    '💻': { color: '#3b82f6', score: 10, text: 'CODE!' },
    '🚀': { color: '#ec4899', score: 20, text: 'LAUNCH!' },
    '⚡': { color: '#fbbf24', score: 15, text: 'POWER!' },
    '🎨': { color: '#8b5cf6', score: 12, text: 'ART!' },
    '📱': { color: '#10b981', score: 10, text: 'MOBILE!' },
    '🔥': { color: '#f97316', score: 25, text: 'FIRE!' },
    '✨': { color: '#a78bfa', score: 30, text: 'SPARKLE!' },
    '🎯': { color: '#ef4444', score: 50, text: 'BULLSEYE!' }
};

// 파티클 버스트 효과
function createParticleBurst(x, y, color, count = 15) {
    const burst = document.createElement('div');
    burst.className = 'particle-burst';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-particle';
        particle.style.backgroundColor = color;
        
        const angle = (Math.PI * 2 * i) / count;
        const distance = 100 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        burst.appendChild(particle);
    }

    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1000);
}

// 충격파 효과
function createShockwave(x, y) {
    const shockwave = document.createElement('div');
    shockwave.className = 'shockwave';
    shockwave.style.left = (x - 100) + 'px';
    shockwave.style.top = (y - 100) + 'px';
    document.body.appendChild(shockwave);
    setTimeout(() => shockwave.remove(), 600);
}

// 화면 플래시 효과
function createScreenFlash() {
    const flash = document.createElement('div');
    flash.className = 'screen-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
}

// 점수 팝업
function showScorePopup(x, y, score, text, color) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${score} ${text}`;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.color = color;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

// 콤보 표시 업데이트
function updateCombo() {
    comboCount++;

    if (comboCount >= 3) {
        // 배경 콤보 업데이트
        backgroundComboDisplay.textContent = `COMBO x${comboCount}`;
        backgroundComboDisplay.style.display = 'block';

        // 5콤보 이상일 때 화면 플래시
        if (comboCount % 5 === 0) {
            createScreenFlash();
        }
    } else {
        backgroundComboDisplay.style.display = 'none';
    }

    // 콤보 타이머 리셋
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
        comboCount = 0;
        backgroundComboDisplay.style.display = 'none';
    }, 2000); // 콤보 지속 시간 2초
}

// 총 점수 업데이트 (배경 점수만 업데이트)
function updateTotalScore(points) {
    totalScore += points * (comboCount >= 3 ? comboCount : 1);
    
    // 1. 배경 점수 업데이트
    backgroundTotalScoreDisplay.textContent = totalScore.toLocaleString();
    
    // 화면 귀퉁이 점수 업데이트 로직은 제거됨
}

// 이모지 클릭 이벤트
document.querySelectorAll('.icon-item').forEach(icon => {
    icon.addEventListener('click', function(e) {
        const emoji = this.textContent.trim();
        const effect = emojiEffects[emoji];
        
        if (!effect) return;

        const rect = this.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // 아이콘 애니메이션
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 400);

        // 효과 실행
        createParticleBurst(x, y, effect.color);
        createShockwave(x, y);
        showScorePopup(x, y, effect.score, effect.text, effect.color);
        updateCombo();
        updateTotalScore(effect.score);

        // 애니메이션 일시 정지/재개
        const track = document.querySelector('.icon-track');
        track.style.animationPlayState = 'paused';
        setTimeout(() => {
            track.style.animationPlayState = 'running';
        }, 200);
    });
});

// ===========================================
// Recent Activity (Mixed: Commits, Issues, Releases)
// ===========================================
async function loadActivities() {
    const container = document.getElementById('commitsContainer');
    const GITHUB_USERNAME = 'sunbang123';
    
    // 1. 가져올 파일들의 경로 설정
    const files = [
        { type: 'commit', path: '/_data/commits_data.json' },
        { type: 'issue',  path: '/_data/issues_data.json' },
        { type: 'release', path: '/_data/releases_data.json' }
    ];

    try {
        // 2. 병렬로 모든 데이터 요청
        const results = await Promise.all(files.map(async (file) => {
            try {
                const res = await fetch(file.path);
                if (!res.ok) return []; 
                const data = await res.json();
                // last_updated 등 불필요한 데이터 제거
                const validData = data.filter(item => item.repo !== undefined);
                return validData.map(item => ({ ...item, dataType: file.type }));
            } catch (e) {
                console.warn(`${file.path} 로드 실패`, e);
                return [];
            }
        }));

        const allActivities = results.flat();

        // [추가] 내 이름이 여러 개로 보일 때 하나로 통일하는 함수
        function normalizeAuthor(name) {
            // 여기에 커밋에 찍히는 내 다른 이름들을 배열로 적어주세요
            // 예: ['Sunbang', 'Sunbang Lee', 'tjsqkd'] 
            // 팁: 그냥 내 레포지토리니까 웬만하면 다 나라고 가정하고 싶다면 로직을 단순화해도 됩니다.
            
            // 1. 내 GitHub 아이디와 같으면 통과
            if (name === GITHUB_USERNAME) return name;

            // 2. 내 컴퓨터 닉네임들이라면 'sunbang123'으로 변경 (필요한 경우 이름 추가)
            const myAliases = ['Sunbang', 'sunbang', 'admin']; 
            if (myAliases.includes(name)) return GITHUB_USERNAME;

            // 3. 만약 그냥 전부 'sunbang123'으로 통일하고 싶다면 아래 주석을 해제하세요
            return GITHUB_USERNAME; 
            
            // return name; // 다른 사람일 경우 원래 이름 표시
        }

        // 4. 데이터 정규화
        const normalizedData = allActivities.map(item => {
            let title, url, meta, icon, badgeColor;
            const date = new Date(item.date); 
            // 작성자 이름 통일 적용
            const author = normalizeAuthor(item.author || 'Me');

            if (item.dataType === 'commit') {
                title = item.message.split('\n')[0];
                url = `https://github.com/${GITHUB_USERNAME}/${item.repo}/commit/${item.sha}`;
                meta = item.sha.substring(0, 7);
                icon = 'Commit';
                badgeColor = '#64b4f684'; 
            } else if (item.dataType === 'issue') {
                const isPR = item.type === 'pull_request'; 
                title = item.title;
                url = item.url;
                meta = `#${item.number}`;
                icon = isPR ? 'PR' : 'Issue';
                badgeColor = isPR ? '#81c78485' : '#ffb84d85'; 
            } else if (item.dataType === 'release') {
                title = item.name || item.tag;
                url = item.url;
                meta = item.tag;
                icon = 'Release';
                badgeColor = '#ba68c885';
            }

            return {
                date: date,
                repo: item.repo,
                author: author, // 통일된 이름 사용
                title, url, meta, icon, badgeColor
            };
        });

        // 5. 날짜 내림차순 정렬 (최신순)
        normalizedData.sort((a, b) => b.date - a.date);

        const recentActivities = normalizedData.slice(0, 20);

        if (recentActivities.length === 0) {
            container.innerHTML = '<p class="error-message">최근 활동 데이터가 없습니다.</p>';
            return;
        }

        // 6. HTML 구성
        let html = '';
        let currentRepo = '';

        recentActivities.forEach(item => {
            if (item.repo !== currentRepo) {
                html += `<h3 style="margin-top: 1.5rem; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom:5px;">📂 ${item.repo}</h3>`;
                currentRepo = item.repo;
            }

            const dateStr = item.date.toLocaleDateString('ko-KR');
            const badgeStyle = `display:inline-block; font-size:0.75rem; padding:2px 6px; border-radius:4px; color:#fff; background-color:${item.badgeColor}; margin-right:5px; vertical-align:middle;`;

            html += `
                <div class="commit-item" style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <a href="${item.url}" target="_blank" style="text-decoration:none; color:inherit;">
                        <div class="commit-message" style="font-weight:bold; margin-bottom:4px;">
                            <span style="${badgeStyle}">${item.icon}</span> ${item.title}
                        </div>
                    </a>
                    <div class="commit-meta" style="font-size:0.85rem; color:#aaa;">
                        <span class="commit-author">👤 ${item.author}</span>
                        <span style="margin: 0 5px;">•</span>
                        <span class="commit-date">📅 ${dateStr}</span>
                        <span style="margin: 0 5px;">•</span>
                        <span class="commit-sha" style="font-family:monospace;">${item.meta}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="error-message">활동 정보를 불러오는데 실패했습니다: ${error.message}</p>`;
    }
}

loadActivities();