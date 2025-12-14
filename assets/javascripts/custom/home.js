
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
// Recent Activity (GitHub Commits) 로직
// ===========================================
async function loadCommits() {
    const container = document.getElementById('commitsContainer');
    const dataPath = '/_data/commits_data.json'; // 생성된 정적 JSON 파일 경로 (Jekyll 환경 가정)
    
    try {
        // 1. 서버에 미리 저장된 정적 JSON 파일 요청
        const res = await fetch(dataPath);
        
        // 파일이 없거나 오류 발생 시 오류 메시지 표시
        if (!res.ok) {
            if (res.status === 404) {
                throw new Error("커밋 데이터 파일(commits_data.json)을 찾을 수 없습니다. GitHub Actions 실행 상태를 확인하세요.");
            }
            throw new Error(`파일 로드 실패: ${res.status}`);
        }

        const allCommits = await res.json();
        
        // 2. HTML 구성
        let html = '';
        let currentRepo = '';

        // 최근 15개 커밋만 표시 (선택 사항)
        const recentCommits = allCommits.slice(0, 15); 

        if (recentCommits.length === 0) {
                container.innerHTML = '<p class="error-message">커밋 데이터가 없습니다. Actions 빌드 후 데이터를 확인해주세요.</p>';
                return;
        }

        recentCommits.forEach(commit => {
            if (commit.repo !== currentRepo) {
                html += `<h3 style="margin-top: 1.5rem; color: #fff;">📦 ${commit.repo}</h3>`;
                currentRepo = commit.repo;
            }

            // 날짜 포맷팅 (ISO 문자열에서 변환)
            const dateObj = new Date(commit.date);
            const dateStr = dateObj.toLocaleDateString('ko-KR');
            const sha = commit.sha.substring(0, 7);
            const message = commit.message.split('\n')[0];
            const commitUrl = `https://github.com/sunbang123/${commit.repo}/commit/${commit.sha}`;

            html += `
                <div class="commit-item">
                    <a href="${commitUrl}" target="_blank" title="${message} 커밋 상세 보기">
                        <div class="commit-message">${message}</div>
                    </a>
                    <div class="commit-meta">
                        <span class="commit-author">👤 ${commit.author}</span>
                        <span class="commit-date">📅 ${dateStr}</span>
                        <span class="commit-sha">${sha}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="error-message">커밋 정보를 불러오는데 실패했습니다: ${error.message}</p>`;
    }
}

loadCommits();