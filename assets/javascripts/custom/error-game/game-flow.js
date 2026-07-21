import { JUMP_POWER, DOUBLE_JUMP_POWER, STAND_HEIGHT } from './constants.js';
import { isLightTheme } from './draw-utils.js';
import { placePlayerOnGround } from './player.js';
import { triggerShake, spawnParticles, spawnFloatingText } from './effects.js';
import { setLabels, setOverlay, setRetryButton } from './hud.js';
import { saveBest, saveBestSignals } from './state.js';

export function resetGame(state) {
    state.mode = 'running';
    state.distance = 0;
    state.elapsed = 0;
    state.score = 0;
    state.bonusScore = 0;
    state.signals = 0;
    state.speed = 390;
    state.obstacles = [];
    state.collectibles = [];
    state.particles = [];
    state.floatingTexts = [];
    state.bannerHint = null;
    state.nextObstacle = 0.75;
    state.nextSignal = 1.25;
    state.comboStreak = 0;
    state.lastSignalTime = -Infinity;
    state.shieldProgress = 0;
    state.shieldCount = 0;
    state.invulnTime = 0;
    state.shakeTime = 0;
    state.ghost = null;
    state.ghostCooldown = 3;

    const { player } = state;
    player.vy = 0;
    player.grounded = true;
    player.ducking = false;
    player.height = STAND_HEIGHT;
    player.jumpsUsed = 0;
    player.fastFalling = false;
    placePlayerOnGround(state);

    state.elements.startButton.textContent = 'Jump';
    setRetryButton(state, false);
    setOverlay(state, false);
    setLabels(state);
}

export function gameOver(state) {
    state.mode = 'over';
    state.best = Math.max(state.best, state.score);
    saveBest(state);
    saveBestSignals(state);
    triggerShake(state, 14, 0.4);
    spawnParticles(state, state.player.x + state.player.width / 2, state.player.y + state.player.height / 2, '#f87171', 22);
    state.elements.startButton.textContent = 'Retry';
    setRetryButton(state, true);
    setLabels(state);
    setOverlay(state, true, 'Route dropped :(', `Score ${state.score} / Signals ${state.signals}`);
}

export function jump(state) {
    if (state.mode === 'idle') return;

    if (state.mode === 'over') {
        resetGame(state);
        return;
    }

    const { player, world } = state;

    if (player.grounded) {
        player.vy = JUMP_POWER;
        player.grounded = false;
        player.jumpsUsed = 1;
        spawnParticles(state, player.x + player.width / 2, world.groundY, isLightTheme() ? 'rgba(30,41,59,0.45)' : 'rgba(226,232,240,0.5)', 5);
    } else if (player.jumpsUsed === 1) {
        player.vy = DOUBLE_JUMP_POWER;
        player.jumpsUsed = 2;
        spawnParticles(state, player.x + player.width / 2, player.y + player.height / 2, '#a7f3d0', 10);
        spawnFloatingText(state, player.x, player.y - 10, 'DOUBLE JUMP!', '#a7f3d0');
    }
}

export function revealGame(state) {
    if (state.mode !== 'idle') return;

    state.secretClicks += 1;

    if (state.secretClicks === 1) {
        setOverlay(state, true, 'Page still not found :0', 'A recovery route is hiding nearby.');
        return;
    }

    if (state.secretClicks === 2) {
        setOverlay(state, true, 'Oh, You still not found? :)', 'Hi, Player!', 'Run!');
        return;
    }

    resetGame(state);
}
