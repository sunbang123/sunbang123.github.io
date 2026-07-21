import { GRAVITY, COMBO_WINDOW, GHOST_SPEED_THRESHOLD, FAST_FALL_GRAVITY_MULTIPLIER } from './constants.js';
import { createState } from './state.js';
import { isLightTheme } from './draw-utils.js';
import { updateEffects, drawParticles, drawFloatingTexts, drawBannerHint, spawnParticles, triggerShake } from './effects.js';
import { setLabels, setOverlay, setRetryButton } from './hud.js';
import { placePlayerOnGround } from './player.js';
import { spawnObstacle, maybeSpawnPattern, drawObstacle, handleObstacleCollisions } from './obstacles.js';
import { spawnSignal, drawSignal, handleCollectibleCollisions } from './collectibles.js';
import { spawnGhost, updateGhost, drawGhost } from './ghost.js';
import { drawBackground, drawPlayer, drawIdleMark } from './render.js';
import { wireInput } from './input.js';

function initErrorGame() {
    const root = document.querySelector('[data-error-game-root]');
    if (!root) return;

    const elements = {
        root,
        canvas: root.querySelector('[data-error-game-canvas]'),
        startButton: root.querySelector('[data-error-game-start]'),
        overlay: root.querySelector('[data-error-game-overlay]'),
        titleLabel: root.querySelector('[data-error-game-title]'),
        stateLabel: root.querySelector('[data-error-game-state]'),
        messageLabel: root.querySelector('[data-error-game-message]'),
        scoreLabel: root.querySelector('[data-error-game-score]'),
        bestLabel: root.querySelector('[data-error-game-best]'),
        signalsLabel: root.querySelector('[data-error-game-signals]'),
        bestSignalsLabel: root.querySelector('[data-error-game-best-signals]'),
        comboLabel: root.querySelector('[data-error-game-combo]'),
        comboBadge: root.querySelector('[data-error-game-combo-badge]'),
        shieldLabel: root.querySelector('[data-error-game-shield]'),
        shieldBadge: root.querySelector('[data-error-game-shield-badge]'),
        touchJumpButton: root.querySelector('[data-error-game-touch-jump]'),
        touchDuckButton: root.querySelector('[data-error-game-touch-duck]')
    };

    const ctx = elements.canvas.getContext('2d');
    const state = createState(elements);

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = elements.canvas.getBoundingClientRect();
        const layoutWidth = document.documentElement.clientWidth || window.innerWidth || rect.width || 1440;
        const cssWidth = Math.max(320, Math.min(rect.width || layoutWidth, layoutWidth));
        const cssHeight = Math.max(1, rect.height || 720);
        const isPortraitPhone = cssWidth < 720 && cssHeight > cssWidth;
        const isSmallLandscape = cssWidth < 940 && cssWidth > cssHeight;

        const { world, player } = state;
        world.viewportZoom = isPortraitPhone ? 1.58 : isSmallLandscape ? 1.18 : 1;
        world.width = cssWidth * world.viewportZoom;
        world.height = cssHeight * world.viewportZoom;
        world.groundY = Math.max(250, world.height - Math.min(112, world.height * 0.18));

        elements.canvas.width = Math.round(cssWidth * dpr);
        elements.canvas.height = Math.round(cssHeight * dpr);
        ctx.setTransform(dpr / world.viewportZoom, 0, 0, dpr / world.viewportZoom, 0, 0);

        if (player.grounded || state.mode !== 'running') {
            placePlayerOnGround(state);
        } else {
            player.y = Math.min(player.y, world.groundY - player.height);
        }

        draw();
    }

    function update(delta) {
        updateEffects(state, delta);
        if (state.mode !== 'running') return;

        state.elapsed += delta;
        if (state.comboStreak > 0 && state.elapsed - state.lastSignalTime > COMBO_WINDOW) {
            state.comboStreak = 0;
            setLabels(state);
        }

        state.distance += state.speed * delta;
        state.speed = Math.min(720, 390 + state.distance * 0.018);
        state.score = Math.floor(state.distance / 12) + state.bonusScore;

        const { player, world } = state;
        const wasGrounded = player.grounded;

        const gravityScale = (player.ducking && !player.grounded) ? FAST_FALL_GRAVITY_MULTIPLIER : 1;
        player.vy += GRAVITY * gravityScale * delta;
        player.y += player.vy * delta;

        if (player.y >= world.groundY - player.height) {
            player.y = world.groundY - player.height;
            player.vy = 0;
            player.grounded = true;
            player.jumpsUsed = 0;
        }

        if (!wasGrounded && player.grounded) {
            const dustColor = isLightTheme() ? 'rgba(30,41,59,0.4)' : 'rgba(226,232,240,0.45)';
            if (player.fastFalling) {
                player.fastFalling = false;
                spawnParticles(state, player.x + player.width / 2, world.groundY, dustColor, 14);
                triggerShake(state, 5, 0.18);
            } else {
                spawnParticles(state, player.x + player.width / 2, world.groundY, dustColor, 6);
            }
        }

        state.nextObstacle -= delta;
        state.nextSignal -= delta;

        if (state.nextObstacle <= 0) {
            if (!maybeSpawnPattern(state)) {
                spawnObstacle(state);
                state.nextObstacle = 0.78 + Math.random() * 0.72;
            }
        }

        if (state.nextSignal <= 0) {
            spawnSignal(state);
            state.nextSignal = 1.65 + Math.random() * 1.25;
        }

        state.obstacles.forEach((item) => { item.x -= state.speed * delta; });
        state.collectibles.forEach((item) => { item.x -= state.speed * delta; });

        state.obstacles = state.obstacles.filter((item) => item.x + item.width > -32);
        state.collectibles = state.collectibles.filter((item) => item.x + item.width > -32 && !item.taken);

        if (state.ghostCooldown > 0) {
            state.ghostCooldown -= delta;
        } else if (!state.ghost && state.speed >= GHOST_SPEED_THRESHOLD) {
            spawnGhost(state);
        }
        updateGhost(state, delta);
        if (state.mode !== 'running') return;

        handleObstacleCollisions(state, delta);
        if (state.mode !== 'running') return;

        handleCollectibleCollisions(state);

        setLabels(state);
    }

    function draw() {
        ctx.save();
        if (state.shakeTime > 0) {
            const power = state.shakeMag * (state.shakeTime / state.shakeDuration);
            ctx.translate((Math.random() - 0.5) * power * 2, (Math.random() - 0.5) * power * 2);
        }

        ctx.clearRect(-40, -40, state.world.width + 80, state.world.height + 80);
        drawBackground(ctx, state);
        state.collectibles.forEach((item) => drawSignal(ctx, item));
        state.obstacles.forEach((item) => drawObstacle(ctx, item, state));
        if (state.ghost) drawGhost(ctx, state.ghost, state);
        drawPlayer(ctx, state);
        drawParticles(ctx, state);
        drawFloatingTexts(ctx, state);
        drawBannerHint(ctx, state);

        if (state.mode === 'idle' || state.mode === 'over') {
            drawIdleMark(ctx, state);
        }

        ctx.restore();
    }

    function loop(time) {
        const delta = Math.min((time - state.lastTime) / 1000 || 0, 0.032);
        state.lastTime = time;
        update(delta);
        draw();
        requestAnimationFrame(loop);
    }

    wireInput(state);

    window.addEventListener('resize', resizeCanvas);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', resizeCanvas);
    }
    if (window.ResizeObserver) {
        new ResizeObserver(resizeCanvas).observe(elements.canvas);
    }

    elements.startButton.textContent = 'Retry';
    setRetryButton(state, false);
    setOverlay(state, true, 'Page not found :(', 'The requested page could not be found.');
    setLabels(state);
    resizeCanvas();
    requestAnimationFrame(resizeCanvas);
    window.setTimeout(resizeCanvas, 120);
    requestAnimationFrame((time) => {
        state.lastTime = time;
        requestAnimationFrame(loop);
    });
}

initErrorGame();
