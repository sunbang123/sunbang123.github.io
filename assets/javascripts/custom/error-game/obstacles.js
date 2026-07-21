import { groundObstacleTypes, flyObstacleTypes, DUCK_HEIGHT } from './constants.js';
import { roundRect, collide } from './draw-utils.js';
import { triggerShake, spawnParticles, spawnFloatingText } from './effects.js';
import { setLabels } from './hud.js';
import { gameOver } from './game-flow.js';

export function pickGroundTemplate() {
    return groundObstacleTypes[Math.floor(Math.random() * groundObstacleTypes.length)];
}

export function pickFlyTemplate() {
    return flyObstacleTypes[Math.floor(Math.random() * flyObstacleTypes.length)];
}

export function buildObstacle(state, template, xPos) {
    const { world } = state;
    const scale = 0.92 + Math.random() * 0.18;
    const width = Math.round(template.width * scale);
    const height = Math.round(template.height * scale);
    const isFlying = template.kind === 'flying';
    const y = isFlying
        ? world.groundY - DUCK_HEIGHT - 4 - height
        : world.groundY - height;

    return {
        x: xPos,
        y,
        width,
        height,
        kind: template.kind,
        label: template.label,
        color: template.color,
        accent: template.accent,
        seed: Math.random() * Math.PI * 2
    };
}

export function spawnObstacle(state) {
    const flyChance = Math.min(0.45, 0.22 + state.distance * 0.00002);
    const template = Math.random() < flyChance ? pickFlyTemplate() : pickGroundTemplate();
    state.obstacles.push(buildObstacle(state, template, state.world.width + 28));
}

export function maybeSpawnPattern(state) {
    if (state.distance < 700 || Math.random() > 0.24) return false;

    const kinds = ['double-ground', 'jump-duck', 'duck-jump'];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const gapSeconds = kind === 'double-ground' ? 0.5 : 0.62;
    const gapPx = state.speed * gapSeconds;
    const baseX = state.world.width + 28;

    if (kind === 'double-ground') {
        state.obstacles.push(buildObstacle(state, pickGroundTemplate(), baseX));
        state.obstacles.push(buildObstacle(state, pickGroundTemplate(), baseX + gapPx));
    } else if (kind === 'jump-duck') {
        state.obstacles.push(buildObstacle(state, pickGroundTemplate(), baseX));
        state.obstacles.push(buildObstacle(state, pickFlyTemplate(), baseX + gapPx));
    } else {
        state.obstacles.push(buildObstacle(state, pickFlyTemplate(), baseX));
        state.obstacles.push(buildObstacle(state, pickGroundTemplate(), baseX + gapPx));
    }

    state.nextObstacle = 1.15 + Math.random() * 0.65;
    return true;
}

// Regular obstacles only ever consume a single shield charge. The
// ghost-only "shield attack" lives in ghost.js.
export function handleObstacleCollisions(state, delta) {
    if (state.invulnTime > 0) {
        state.invulnTime = Math.max(0, state.invulnTime - delta);
        return;
    }

    const { player } = state;
    for (const item of state.obstacles) {
        if (!collide(player, item)) continue;

        if (state.shieldCount > 0) {
            state.shieldCount -= 1;
            state.invulnTime = 0.9;
            item.x = -9999;
            triggerShake(state, 6, 0.25);
            spawnParticles(state, player.x + player.width / 2, player.y + player.height / 2, '#67e8f9', 16);
            spawnFloatingText(state, player.x, player.y - 14, 'SHIELD BREAK!', '#67e8f9');
            setLabels(state);
        } else {
            gameOver(state);
            return;
        }
        break;
    }
}

export function drawObstacle(ctx, item, state) {
    const x = item.x;
    const bobOffset = item.kind === 'flying' ? Math.sin(state.distance * 0.012 + item.seed) * 5 : 0;
    const y = item.y + bobOffset;
    const w = item.width;
    const h = item.height;
    const accent = item.accent || '#dc2626';

    ctx.save();

    if (item.kind === 'flying') {
        roundRect(ctx, x, y, w, h, 10);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x + w - 11, y + 11, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + w - 14, y + 8);
        ctx.lineTo(x + w - 8, y + 14);
        ctx.moveTo(x + w - 8, y + 8);
        ctx.lineTo(x + w - 14, y + 14);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.fillRect(x + 8, y + h - 14, w - 30, 4);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 2, y + h / 2);
        ctx.lineTo(x - 13, y + h / 2 - 6 - Math.abs(bobOffset));
        ctx.moveTo(x - 2, y + h / 2);
        ctx.lineTo(x - 13, y + h / 2 + 6 + Math.abs(bobOffset));
        ctx.stroke();
    } else if (item.kind === 'loop') {
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(x + w * 0.36, y + h * 0.48, h * 0.22, 0.25, Math.PI * 1.9);
        ctx.arc(x + w * 0.64, y + h * 0.48, h * 0.22, Math.PI * 1.25, Math.PI * 0.9, true);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.moveTo(x + w - 12, y + h * 0.38);
        ctx.lineTo(x + w - 2, y + h * 0.49);
        ctx.lineTo(x + w - 16, y + h * 0.56);
        ctx.closePath();
        ctx.fill();
    } else if (item.kind === 'dns') {
        roundRect(ctx, x, y + 5, w, h - 5, 8);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x + w * 0.5, y + h * 0.5, h * 0.24, 0, Math.PI * 2);
        ctx.moveTo(x + w * 0.26, y + h * 0.5);
        ctx.lineTo(x + w * 0.74, y + h * 0.5);
        ctx.moveTo(x + w * 0.5, y + h * 0.24);
        ctx.lineTo(x + w * 0.5, y + h * 0.76);
        ctx.stroke();
    } else if (item.kind === 'server') {
        roundRect(ctx, x, y, w, h, 7);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.fillStyle = accent;
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(x + 8, y + 13 + i * 18, w - 16, 4);
            ctx.fillRect(x + w - 15, y + 10 + i * 18, 5, 5);
        }
    } else if (item.kind === 'timeout') {
        roundRect(ctx, x, y, w, h, 8);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x + 18, y + h / 2, 11, 0, Math.PI * 2);
        ctx.moveTo(x + 18, y + h / 2);
        ctx.lineTo(x + 18, y + h / 2 - 7);
        ctx.moveTo(x + 18, y + h / 2);
        ctx.lineTo(x + 25, y + h / 2 + 4);
        ctx.stroke();
        ctx.fillRect(x + 38, y + 17, w - 48, 5);
    } else if (item.kind === 'broken-link') {
        roundRect(ctx, x, y + 5, w, h - 10, 9);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x + 22, y + h / 2, 13, Math.PI * 0.2, Math.PI * 1.8);
        ctx.arc(x + w - 22, y + h / 2, 13, Math.PI * 1.2, Math.PI * 0.8, true);
        ctx.stroke();
        ctx.strokeStyle = '#052e2b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 6, y + 12);
        ctx.lineTo(x + w / 2 + 3, y + h - 13);
        ctx.moveTo(x + w / 2 + 4, y + 12);
        ctx.lineTo(x + w / 2 + 13, y + h - 13);
        ctx.stroke();
    } else {
        roundRect(ctx, x, y, w, h, 6);
        ctx.fillStyle = item.color || '#f8fafc';
        ctx.fill();

        ctx.fillStyle = '#fecaca';
        ctx.beginPath();
        ctx.moveTo(x + w - 15, y);
        ctx.lineTo(x + w, y + 15);
        ctx.lineTo(x + w - 15, y + 15);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = accent;
        ctx.fillRect(x + 7, y + 12, w - 18, 5);
        ctx.fillRect(x + 7, y + 24, w - 14, 4);
    }

    ctx.fillStyle = '#0f172a';
    ctx.font = `900 ${item.label.length > 5 ? 10 : 12}px Poppins, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + w / 2, y + h - 9);
    ctx.restore();
}
