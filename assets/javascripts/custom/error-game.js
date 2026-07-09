(function initErrorGame() {
    const root = document.querySelector('[data-error-game-root]');
    if (!root) return;

    const canvas = root.querySelector('[data-error-game-canvas]');
    const ctx = canvas.getContext('2d');
    const startButton = root.querySelector('[data-error-game-start]');
    const overlay = root.querySelector('[data-error-game-overlay]');
    const titleLabel = root.querySelector('[data-error-game-title]');
    const stateLabel = root.querySelector('[data-error-game-state]');
    const messageLabel = root.querySelector('[data-error-game-message]');
    const scoreLabel = root.querySelector('[data-error-game-score]');
    const bestLabel = root.querySelector('[data-error-game-best]');
    const signalsLabel = root.querySelector('[data-error-game-signals]');
    const bestSignalsLabel = root.querySelector('[data-error-game-best-signals]');

    const GRAVITY = 2250;
    const JUMP_POWER = -790;
    const SCORE_STORAGE_KEY = 'error-runner-best';
    const SIGNAL_STORAGE_KEY = 'error-runner-best-signals';

    const world = {
        width: 1440,
        height: 720,
        groundY: 590
    };

    const player = {
        x: 148,
        y: 0,
        width: 48,
        height: 56,
        vy: 0,
        grounded: true
    };

    let mode = 'idle';
    let lastTime = 0;
    let distance = 0;
    let score = 0;
    let signals = 0;
    let speed = 390;
    let nextObstacle = 0;
    let nextSignal = 0;
    let obstacles = [];
    let collectibles = [];
    let best = Number(localStorage.getItem(SCORE_STORAGE_KEY) || 0);
    let bestSignals = Number(localStorage.getItem(SIGNAL_STORAGE_KEY) || 0);
    let secretClicks = 0;

    function isLightTheme() {
        return document.documentElement.dataset.theme === 'light';
    }

    function saveBestSignals() {
        if (signals <= bestSignals) return;
        bestSignals = signals;
        localStorage.setItem(SIGNAL_STORAGE_KEY, String(bestSignals));
    }

    function setLabels() {
        scoreLabel.textContent = String(score);
        bestLabel.textContent = String(best);
        signalsLabel.textContent = String(signals);
        if (bestSignalsLabel) bestSignalsLabel.textContent = String(bestSignals);
    }

    function setOverlay(isVisible, state, message, title) {
        overlay.classList.toggle('is-hidden', !isVisible);
        if (title) titleLabel.textContent = title;
        if (state) stateLabel.textContent = state;
        if (message) messageLabel.textContent = message;
    }

    function setRetryButton(isVisible) {
        startButton.hidden = !isVisible;
    }

    function placePlayerOnGround() {
        player.x = Math.max(92, Math.min(158, world.width * 0.14));
        player.y = world.groundY - player.height;
    }

    function resetGame() {
        mode = 'running';
        distance = 0;
        score = 0;
        signals = 0;
        speed = 390;
        obstacles = [];
        collectibles = [];
        nextObstacle = 0.75;
        nextSignal = 1.25;
        player.vy = 0;
        player.grounded = true;
        placePlayerOnGround();
        startButton.textContent = 'Jump';
        setRetryButton(false);
        setOverlay(false);
        setLabels();
    }

    function gameOver() {
        mode = 'over';
        best = Math.max(best, score);
        localStorage.setItem(SCORE_STORAGE_KEY, String(best));
        saveBestSignals();
        startButton.textContent = 'Retry';
        setRetryButton(true);
        setLabels();
        setOverlay(true, 'Route dropped :(', `Score ${score} / Signals ${signals}`);
    }

    function jump() {
        if (mode === 'idle') return;

        if (mode === 'over') {
            resetGame();
            return;
        }

        if (player.grounded) {
            player.vy = JUMP_POWER;
            player.grounded = false;
        }
    }

    function revealGame() {
        if (mode !== 'idle') return;

        secretClicks += 1;

        if (secretClicks === 1) {
            setOverlay(true, 'Page still not found :0', 'A recovery route is hiding nearby.');
            return;
        }

        if (secretClicks === 2) {
            setOverlay(true, 'Oh, You still not found? :)', 'Hi, Player!', 'Run!');
            return;
        }

        resetGame();
    }

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        world.width = Math.max(320, rect.width || 1440);
        world.height = Math.max(360, rect.height || 720);
        world.groundY = Math.max(250, world.height - Math.min(112, world.height * 0.18));

        canvas.width = Math.round(world.width * dpr);
        canvas.height = Math.round(world.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (player.grounded || mode !== 'running') {
            placePlayerOnGround();
        } else {
            player.y = Math.min(player.y, world.groundY - player.height);
        }

        draw();
    }

    function roundRect(x, y, width, height, radius) {
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + height, r);
        ctx.arcTo(x + width, y + height, x, y + height, r);
        ctx.arcTo(x, y + height, x, y, r);
        ctx.arcTo(x, y, x + width, y, r);
        ctx.closePath();
    }

    function collide(a, b) {
        return (
            a.x + 7 < b.x + b.width &&
            a.x + a.width - 7 > b.x &&
            a.y + 5 < b.y + b.height &&
            a.y + a.height - 2 > b.y
        );
    }

    function spawnObstacle() {
        const tall = Math.random() > 0.55;
        const width = tall ? 42 : 56;
        const height = tall ? 74 : 48;

        obstacles.push({
            x: world.width + 28,
            y: world.groundY - height,
            width,
            height,
            label: Math.random() > 0.42 ? '404' : 'NULL'
        });
    }

    function spawnSignal() {
        const highLane = Math.random() > 0.5;

        collectibles.push({
            x: world.width + 36,
            y: world.groundY - (highLane ? 170 : 126),
            width: 28,
            height: 28,
            taken: false
        });
    }

    function update(delta) {
        if (mode !== 'running') return;

        distance += speed * delta;
        speed = Math.min(720, 390 + distance * 0.018);
        score = Math.floor(distance / 12) + signals * 25;

        player.vy += GRAVITY * delta;
        player.y += player.vy * delta;

        if (player.y >= world.groundY - player.height) {
            player.y = world.groundY - player.height;
            player.vy = 0;
            player.grounded = true;
        }

        nextObstacle -= delta;
        nextSignal -= delta;

        if (nextObstacle <= 0) {
            spawnObstacle();
            nextObstacle = 0.78 + Math.random() * 0.72;
        }

        if (nextSignal <= 0) {
            spawnSignal();
            nextSignal = 1.65 + Math.random() * 1.25;
        }

        obstacles.forEach((item) => {
            item.x -= speed * delta;
        });

        collectibles.forEach((item) => {
            item.x -= speed * delta;
        });

        obstacles = obstacles.filter((item) => item.x + item.width > -32);
        collectibles = collectibles.filter((item) => item.x + item.width > -32 && !item.taken);

        for (const item of obstacles) {
            if (collide(player, item)) {
                gameOver();
                return;
            }
        }

        for (const item of collectibles) {
            if (collide(player, item)) {
                item.taken = true;
                signals += 1;
                saveBestSignals();
            }
        }

        setLabels();
    }

    function drawBackground() {
        const light = isLightTheme();
        const sky = ctx.createLinearGradient(0, 0, 0, world.height);
        sky.addColorStop(0, light ? '#eef7ff' : '#07111f');
        sky.addColorStop(0.55, light ? '#e7eef8' : '#0f172a');
        sky.addColorStop(1, light ? '#eef2f6' : '#102019');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, world.width, world.height);

        ctx.strokeStyle = light ? 'rgba(37, 99, 235, 0.11)' : 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        for (let x = -140; x < world.width + 140; x += 58) {
            const shifted = x - (distance * 0.15) % 58;
            ctx.beginPath();
            ctx.moveTo(shifted, 0);
            ctx.lineTo(shifted + 150, world.height);
            ctx.stroke();
        }

        ctx.fillStyle = light ? 'rgba(37, 99, 235, 0.28)' : 'rgba(103, 232, 249, 0.55)';
        for (let i = 0; i < 38; i++) {
            const x = (i * 149 - distance * 0.18) % world.width;
            const y = 46 + (i * 53) % Math.max(140, world.groundY - 110);
            ctx.fillRect((x + world.width) % world.width, y, 3, 3);
        }

        ctx.fillStyle = light ? '#dbeafe' : '#0b1320';
        ctx.fillRect(0, world.groundY, world.width, world.height - world.groundY);

        ctx.strokeStyle = light ? '#2563eb' : '#67e8f9';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, world.groundY + 1);
        ctx.lineTo(world.width, world.groundY + 1);
        ctx.stroke();

        ctx.fillStyle = light ? 'rgba(37, 99, 235, 0.22)' : 'rgba(167, 243, 208, 0.28)';
        for (let x = -100; x < world.width + 100; x += 76) {
            const shifted = x - (distance * 0.9) % 76;
            ctx.fillRect(shifted, world.groundY + 28, 36, 4);
        }

        ctx.fillStyle = light ? 'rgba(30, 41, 59, 0.07)' : 'rgba(248, 250, 252, 0.08)';
        ctx.font = '900 22px Poppins, sans-serif';
        ctx.textAlign = 'left';
        for (let i = 0; i < 5; i++) {
            const x = (i * 280 - distance * 0.24) % (world.width + 280);
            ctx.fillText('/missing-route', x - 180, world.groundY - 82 - (i % 2) * 42);
        }
    }

    function drawPlayer() {
        roundRect(player.x, player.y, player.width, player.height, 8);
        ctx.fillStyle = '#a7f3d0';
        ctx.fill();

        ctx.fillStyle = '#052e2b';
        ctx.fillRect(player.x + 8, player.y + 12, player.width - 16, 5);

        ctx.strokeStyle = '#052e2b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(player.x + 12, player.y + 32);
        ctx.lineTo(player.x + 24, player.y + 21);
        ctx.lineTo(player.x + 36, player.y + 32);
        ctx.stroke();

        ctx.fillStyle = '#052e2b';
        ctx.fillRect(player.x + 18, player.y + 32, 12, 12);
    }

    function drawObstacle(item) {
        roundRect(item.x, item.y, item.width, item.height, 6);
        ctx.fillStyle = '#f8fafc';
        ctx.fill();

        ctx.fillStyle = '#fecaca';
        ctx.beginPath();
        ctx.moveTo(item.x + item.width - 15, item.y);
        ctx.lineTo(item.x + item.width, item.y + 15);
        ctx.lineTo(item.x + item.width - 15, item.y + 15);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#dc2626';
        ctx.fillRect(item.x + 7, item.y + 12, item.width - 18, 5);
        ctx.fillRect(item.x + 7, item.y + 24, item.width - 14, 4);

        ctx.fillStyle = '#0f172a';
        ctx.font = '900 13px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, item.x + item.width / 2, item.y + item.height - 11);
    }

    function drawSignal(item) {
        const cx = item.x + item.width / 2;
        const cy = item.y + item.height / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI / 4);
        roundRect(-13, -13, 26, 26, 5);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = '#052e2b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy + 3);
        ctx.lineTo(cx, cy - 6);
        ctx.lineTo(cx + 8, cy + 3);
        ctx.stroke();
    }

    function drawIdleMark() {
        ctx.fillStyle = isLightTheme() ? 'rgba(15, 23, 42, 0.08)' : 'rgba(248, 250, 252, 0.14)';
        ctx.font = `900 ${Math.min(180, world.width * 0.18)}px Poppins, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText('404', world.width - 34, Math.max(130, world.height * 0.26));
    }

    function draw() {
        ctx.clearRect(0, 0, world.width, world.height);
        drawBackground();
        collectibles.forEach(drawSignal);
        obstacles.forEach(drawObstacle);
        drawPlayer();

        if (mode === 'idle' || mode === 'over') {
            drawIdleMark();
        }
    }

    function loop(time) {
        const delta = Math.min((time - lastTime) / 1000 || 0, 0.032);
        lastTime = time;
        update(delta);
        draw();
        requestAnimationFrame(loop);
    }

    startButton.addEventListener('click', jump);
    canvas.addEventListener('pointerdown', () => {
        if (mode === 'idle') return;
        jump();
    });
    root.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        revealGame();
    });
    window.addEventListener('keydown', (event) => {
        if (event.code !== 'Space' && event.code !== 'ArrowUp') return;
        event.preventDefault();
        jump();
    });
    window.addEventListener('resize', resizeCanvas);

    startButton.textContent = 'Retry';
    setRetryButton(false);
    setOverlay(true, 'Page not found :(', 'The requested page could not be found.');
    setLabels();
    resizeCanvas();
    requestAnimationFrame((time) => {
        lastTime = time;
        requestAnimationFrame(loop);
    });
}());
