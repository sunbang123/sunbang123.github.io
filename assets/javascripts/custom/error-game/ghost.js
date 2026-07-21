import {
    GHOST_LIFETIME,
    GHOST_WIDTH,
    GHOST_HEIGHT,
    GHOST_HOMING_RATE,
    GHOST_CHASE_GAP_START,
    GHOST_CHASE_GAP_END,
    GHOST_DASH_FIRST_DELAY_MIN,
    GHOST_DASH_FIRST_DELAY_MAX,
    GHOST_DASH_INTERVAL_MIN,
    GHOST_DASH_INTERVAL_MAX,
    GHOST_TELEGRAPH_TIME,
    GHOST_DASH_TIME,
    GHOST_DASH_RECOVER,
    GHOST_DASH_OVERSHOOT,
    GHOST_MISS_FLY_TIME,
    GHOST_MISS_SPEED_MULTIPLIER,
    SHIELD_ATTACK_THRESHOLD,
    GHOST_FALLEN_GRAVITY,
    GHOST_FALLEN_BOUNCE_VY,
    GHOST_FALLEN_LIFETIME,
    SLAM_SIGNAL_REWARD
} from './constants.js';
import { collide } from './draw-utils.js';
import { triggerShake, spawnParticles, spawnFloatingText } from './effects.js';
import { setLabels } from './hud.js';
import { gameOver } from './game-flow.js';
import { saveBestSignals } from './state.js';

export function spawnGhost(state) {
    // Half the time it creeps up from behind (its usual chase spot);
    // the other half it appears ahead of the player, among the
    // oncoming obstacles, and closes in from the front instead.
    const side = Math.random() < 0.5 ? 'behind' : 'ahead';
    const startX = side === 'behind'
        ? state.player.x - GHOST_CHASE_GAP_START
        : state.world.width + 60;

    state.ghost = {
        x: startX,
        y: state.world.groundY - 100,
        width: GHOST_WIDTH,
        height: GHOST_HEIGHT,
        life: GHOST_LIFETIME,
        maxLife: GHOST_LIFETIME,
        phase: Math.random() * Math.PI * 2,
        side,
        dashPhase: 'chase',
        dashClock: GHOST_DASH_FIRST_DELAY_MIN + Math.random() * (GHOST_DASH_FIRST_DELAY_MAX - GHOST_DASH_FIRST_DELAY_MIN),
        dashVX: 0,
        dashVY: 0,
        hitDuringDash: false
    };
    spawnFloatingText(state, state.player.x, state.player.y - 44, 'SIGNAL GHOST!', '#e879f9');
    triggerShake(state, 4, 0.2);
}

// The ghost is the only thing in the game that can trigger the "shield
// attack": once the player is carrying a full 3-shield charge, colliding
// with the ghost instantly destroys it and burns all 3 shields at once
// instead of the normal single-shield absorb.
function resolveGhostCollision(state) {
    const { player, ghost } = state;
    // Remembered for the rest of this dash: invulnerability frames right
    // after a hit block re-detecting collision, so the dash-completion
    // check can't rely on "is the player overlapping the ghost right now".
    ghost.hitDuringDash = true;

    if (state.shieldCount >= SHIELD_ATTACK_THRESHOLD) {
        state.shieldCount = 0;
        state.invulnTime = 1.1;
        triggerShake(state, 16, 0.45);
        spawnParticles(state, ghost.x + ghost.width / 2, ghost.y + ghost.height / 2, '#facc15', 26);
        spawnFloatingText(state, player.x, player.y - 20, 'SHIELD ATTACK!', '#facc15');
        state.ghost = null;
        state.ghostCooldown = 6 + Math.random() * 5;
        setLabels(state);
        return;
    }

    if (state.shieldCount > 0) {
        state.shieldCount -= 1;
        state.invulnTime = 0.9;
        ghost.life = Math.min(ghost.life, 1.1);
        triggerShake(state, 6, 0.25);
        spawnParticles(state, player.x + player.width / 2, player.y + player.height / 2, '#e879f9', 16);
        spawnFloatingText(state, player.x, player.y - 14, 'SHIELD BREAK!', '#67e8f9');
        setLabels(state);
        return;
    }

    gameOver(state);
}

// Landing a slam attack (ducking mid-air, a committed ground pound) knocks
// the ghost down instead of hurting the player. No screen shake here - a
// stomp lands constantly enough that shaking the whole screen for it gets
// nauseating fast.
function slamGhost(state) {
    const { ghost, player } = state;
    const knockDir = (ghost.x + ghost.width / 2 < player.x + player.width / 2) ? -1 : 1;

    ghost.dashPhase = 'fallen';
    ghost.dashClock = GHOST_FALLEN_LIFETIME;
    ghost.dashVX = knockDir * (140 + Math.random() * 80);
    ghost.dashVY = GHOST_FALLEN_BOUNCE_VY;

    spawnParticles(state, ghost.x + ghost.width / 2, ghost.y + ghost.height / 2, '#facc15', 18);
    spawnFloatingText(state, player.x, player.y - 30, 'SLAM!', '#facc15');
}

// A fallen ghost tumbles to the ground under its own little gravity, rests
// there dazed, and either gets touched for a signal payout or times out.
function updateFallenGhost(state, delta) {
    const { ghost, player, world } = state;
    ghost.dashClock -= delta;

    const restY = world.groundY - ghost.height;
    if (ghost.y < restY) {
        ghost.dashVY += GHOST_FALLEN_GRAVITY * delta;
        ghost.x += ghost.dashVX * delta;
        ghost.y += ghost.dashVY * delta;
        ghost.dashVX *= Math.max(0, 1 - 4 * delta);
        if (ghost.y >= restY) {
            ghost.y = restY;
            ghost.dashVX = 0;
            ghost.dashVY = 0;
        }
    }

    if (collide(player, ghost)) {
        state.signals += SLAM_SIGNAL_REWARD;
        saveBestSignals(state);
        spawnParticles(state, ghost.x + ghost.width / 2, ghost.y + ghost.height / 2, '#facc15', 22);
        spawnFloatingText(state, ghost.x, ghost.y - 16, `+${SLAM_SIGNAL_REWARD} SIGNALS`, '#facc15');
        setLabels(state);
        state.ghost = null;
        state.ghostCooldown = 6 + Math.random() * 5;
        return;
    }

    if (ghost.dashClock <= 0) {
        spawnParticles(state, ghost.x + ghost.width / 2, ghost.y + ghost.height / 2, '#c084fc', 12);
        state.ghost = null;
        state.ghostCooldown = 7 + Math.random() * 6;
    }
}

export function updateGhost(state, delta) {
    const { ghost, player } = state;
    if (!ghost) return;

    if (ghost.dashPhase === 'fallen') {
        updateFallenGhost(state, delta);
        return;
    }

    ghost.life -= delta;
    if (ghost.life <= 0) {
        spawnParticles(state, ghost.x + ghost.width / 2, ghost.y + ghost.height / 2, '#e879f9', 14);
        state.ghost = null;
        state.ghostCooldown = 9 + Math.random() * 7;
        return;
    }

    ghost.dashClock -= delta;

    if (ghost.dashPhase === 'chase') {
        const lifeRatio = Math.min(1, (1 - ghost.life / ghost.maxLife) * 1.3);
        const gap = GHOST_CHASE_GAP_START + (GHOST_CHASE_GAP_END - GHOST_CHASE_GAP_START) * lifeRatio;
        const targetX = ghost.side === 'ahead' ? state.player.x + gap : state.player.x - gap;
        const targetY = state.world.groundY - 100 + Math.sin(state.elapsed * 2.4 + ghost.phase) * 40;
        const ease = Math.min(1, GHOST_HOMING_RATE * delta);
        ghost.x += (targetX - ghost.x) * ease;
        ghost.y += (targetY - ghost.y) * ease;

        if (ghost.dashClock <= 0) {
            ghost.dashPhase = 'telegraph';
            ghost.dashClock = GHOST_TELEGRAPH_TIME;
        }
    } else if (ghost.dashPhase === 'telegraph') {
        if (ghost.dashClock <= 0) {
            const px = state.player.x + state.player.width / 2;
            const py = state.player.y + state.player.height / 2;
            const gx = ghost.x + ghost.width / 2;
            const gy = ghost.y + ghost.height / 2;
            const dx = px - gx;
            const dy = py - gy;
            const dist = Math.max(1, Math.hypot(dx, dy));
            const travel = dist * GHOST_DASH_OVERSHOOT;
            ghost.dashVX = (dx / dist) * (travel / GHOST_DASH_TIME);
            ghost.dashVY = (dy / dist) * (travel / GHOST_DASH_TIME);
            ghost.dashPhase = 'dash';
            ghost.dashClock = GHOST_DASH_TIME;
            ghost.hitDuringDash = false;
            triggerShake(state, 3, 0.12);
            spawnParticles(state, gx, gy, '#f87171', 10);
        }
    } else if (ghost.dashPhase === 'dash') {
        ghost.x += ghost.dashVX * delta;
        ghost.y += ghost.dashVY * delta;
        // Phase completion is decided below, once we know whether this
        // frame's motion actually connected with the player.
    } else if (ghost.dashPhase === 'recover') {
        if (ghost.dashClock <= 0) {
            ghost.dashPhase = 'chase';
            ghost.dashClock = GHOST_DASH_INTERVAL_MIN + Math.random() * (GHOST_DASH_INTERVAL_MAX - GHOST_DASH_INTERVAL_MIN);
        }
    } else if (ghost.dashPhase === 'miss') {
        ghost.x += ghost.dashVX * GHOST_MISS_SPEED_MULTIPLIER * delta;
        ghost.y += ghost.dashVY * GHOST_MISS_SPEED_MULTIPLIER * delta;

        if (ghost.dashClock <= 0) {
            spawnParticles(state, ghost.x + ghost.width / 2, ghost.y + ghost.height / 2, '#c084fc', 12);
            state.ghost = null;
            state.ghostCooldown = 7 + Math.random() * 6;
            return;
        }
    }

    if (collide(state.player, ghost)) {
        if (player.fastFalling) {
            slamGhost(state);
            return;
        }
        if (state.invulnTime <= 0) {
            resolveGhostCollision(state);
            if (!state.ghost) return;
        }
    }

    // A dash that finished without ever connecting (not just this frame -
    // any frame during the dash, even ones masked by post-hit invulnerability)
    // is a dodge: the ghost overcommits, flies off past the player and
    // vanishes, instead of politely recovering to chase again.
    if (ghost.dashPhase === 'dash' && ghost.dashClock <= 0) {
        if (ghost.hitDuringDash) {
            ghost.dashPhase = 'recover';
            ghost.dashClock = GHOST_DASH_RECOVER;
        } else {
            ghost.dashPhase = 'miss';
            ghost.dashClock = GHOST_MISS_FLY_TIME;
            spawnFloatingText(state, ghost.x, ghost.y - 10, 'MISSED!', '#94a3b8');
        }
    }
}

function traceGhostBody(ctx, w, h) {
    const r = w / 2;
    ctx.beginPath();
    ctx.arc(0, 0, r, Math.PI, 0, false);
    ctx.lineTo(r, h * 0.32);
    ctx.quadraticCurveTo(r * 0.66, h * 0.5, r * 0.33, h * 0.32);
    ctx.quadraticCurveTo(0, h * 0.5, -r * 0.33, h * 0.32);
    ctx.quadraticCurveTo(-r * 0.66, h * 0.5, -r, h * 0.32);
    ctx.closePath();
}

export function drawGhost(ctx, g, state) {
    const lifeIn = Math.min(1, (g.maxLife - g.life) / 0.6);
    const lifeOut = Math.min(1, g.life / 0.7);
    const alpha = Math.min(lifeIn, lifeOut);
    const flicker = 0.82 + Math.sin(state.elapsed * 26 + g.phase) * 0.18;
    const isTelegraph = g.dashPhase === 'telegraph';
    const isDash = g.dashPhase === 'dash';
    const isMiss = g.dashPhase === 'miss';
    const isFallen = g.dashPhase === 'fallen';
    const telegraphProgress = isTelegraph ? 1 - Math.max(0, g.dashClock) / GHOST_TELEGRAPH_TIME : 0;
    const pulse = isTelegraph ? 1 + telegraphProgress * 0.35 : 1;
    const missFade = isMiss ? Math.max(0, g.dashClock / GHOST_MISS_FLY_TIME) : 1;
    const fallenFade = isFallen ? Math.min(1, g.dashClock / 0.5) : 1;

    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha * (isFallen ? fallenFade : flicker) * missFade);
    ctx.translate(g.x + g.width / 2, g.y + g.height / 2);
    if (isFallen) ctx.rotate(Math.PI * 0.4);

    if (isTelegraph) {
        ctx.save();
        ctx.strokeStyle = `rgba(248, 113, 113, ${0.35 + telegraphProgress * 0.55})`;
        ctx.lineWidth = 2 + telegraphProgress * 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, g.width * 0.5 + 8 + telegraphProgress * 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(248, 113, 113, ${0.5 + telegraphProgress * 0.5})`;
        ctx.font = '900 16px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('!', 0, -g.height * 0.5 - 10 - telegraphProgress * 6);
        ctx.restore();
    }

    if (isDash || isMiss) {
        const dirLen = Math.max(1, Math.hypot(g.dashVX, g.dashVY));
        const nx = g.dashVX / dirLen;
        const ny = g.dashVY / dirLen;
        const trailSpread = isMiss ? 18 : 12;
        for (let t = 1; t <= 3; t++) {
            ctx.save();
            ctx.globalAlpha *= 0.16;
            ctx.translate(-nx * trailSpread * t, -ny * trailSpread * t);
            traceGhostBody(ctx, g.width, g.height);
            ctx.fillStyle = 'rgba(232, 121, 249, 0.8)';
            ctx.fill();
            ctx.restore();
        }
    }

    ctx.scale(pulse, pulse);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(-3, 0);
    traceGhostBody(ctx, g.width, g.height);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.fill();
    ctx.translate(6, 0);
    traceGhostBody(ctx, g.width, g.height);
    ctx.fillStyle = 'rgba(103, 232, 249, 0.5)';
    ctx.fill();
    ctx.restore();

    traceGhostBody(ctx, g.width, g.height);
    ctx.fillStyle = isFallen ? 'rgba(148, 163, 184, 0.82)' : isTelegraph ? 'rgba(248, 113, 113, 0.82)' : 'rgba(232, 121, 249, 0.82)';
    ctx.fill();

    ctx.save();
    ctx.clip();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.lineWidth = 1;
    for (let ly = -g.height / 2; ly < g.height / 2; ly += 4) {
        ctx.beginPath();
        ctx.moveTo(-g.width / 2, ly);
        ctx.lineTo(g.width / 2, ly);
        ctx.stroke();
    }
    ctx.restore();

    if (isFallen) {
        ctx.strokeStyle = '#1b0b23';
        ctx.lineWidth = 2;
        [-g.width * 0.16, g.width * 0.16].forEach((ex) => {
            ctx.beginPath();
            ctx.moveTo(ex - 4, -8);
            ctx.lineTo(ex + 4, 0);
            ctx.moveTo(ex + 4, -8);
            ctx.lineTo(ex - 4, 0);
            ctx.stroke();
        });
    } else {
        ctx.fillStyle = '#1b0b23';
        ctx.beginPath();
        ctx.arc(-g.width * 0.16, -4, 4.5, 0, Math.PI * 2);
        ctx.arc(g.width * 0.16, -4, 4.5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = '#fdf4ff';
    ctx.font = '900 10px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isFallen ? 'K.O.' : 'PING…', 0, g.height / 2 + 15);

    ctx.restore();

    if (isFallen) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, fallenFade);
        ctx.fillStyle = '#facc15';
        ctx.font = '900 13px Poppins, sans-serif';
        ctx.textAlign = 'center';
        for (let i = 0; i < 3; i++) {
            const a = state.elapsed * 4 + (i / 3) * Math.PI * 2;
            const sx = g.x + g.width / 2 + Math.cos(a) * (g.width * 0.55);
            const sy = g.y - 6 + Math.sin(a) * 6;
            ctx.fillText('*', sx, sy);
        }
        ctx.restore();
    }
}
