import { roundRect } from './draw-utils.js';

export function triggerShake(state, mag, duration) {
    state.shakeMag = mag;
    state.shakeDuration = duration;
    state.shakeTime = duration;
}

export function spawnParticles(state, x, y, color, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const power = 60 + Math.random() * 160;
        state.particles.push({
            x,
            y,
            vx: Math.cos(angle) * power,
            vy: Math.sin(angle) * power - 60,
            life: 0.4 + Math.random() * 0.35,
            maxLife: 0.75,
            color,
            size: 2 + Math.random() * 2.5
        });
    }
}

export function spawnFloatingText(state, x, y, text, color) {
    state.floatingTexts.push({ x, y, text, color, life: 1, maxLife: 1 });
}

// Fixed screen-position banner (e.g. tutorial hints). Unlike floating
// texts it does not track any world entity, so it never drifts as the
// background scrolls past.
export function showBannerHint(state, text, duration = 4.5) {
    state.bannerHint = { text, life: duration, maxLife: duration };
}

export function updateEffects(state, delta) {
    if (state.shakeTime > 0) {
        state.shakeTime = Math.max(0, state.shakeTime - delta);
    }

    state.particles.forEach((p) => {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.vy += 320 * delta;
        p.life -= delta;
    });
    state.particles = state.particles.filter((p) => p.life > 0);

    state.floatingTexts.forEach((t) => {
        t.y -= 42 * delta;
        t.life -= delta;
    });
    state.floatingTexts = state.floatingTexts.filter((t) => t.life > 0);

    if (state.bannerHint) {
        state.bannerHint.life -= delta;
        if (state.bannerHint.life <= 0) state.bannerHint = null;
    }
}

export function drawParticles(ctx, state) {
    state.particles.forEach((p) => {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;
}

export function drawFloatingTexts(ctx, state) {
    state.floatingTexts.forEach((t) => {
        ctx.globalAlpha = Math.max(0, t.life / t.maxLife);
        ctx.fillStyle = t.color;
        ctx.font = '900 16px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(t.text, t.x, t.y);
    });
    ctx.globalAlpha = 1;
}

export function drawBannerHint(ctx, state) {
    const hint = state.bannerHint;
    if (!hint) return;

    const fadeIn = Math.min(1, (hint.maxLife - hint.life) / 0.35);
    const fadeOut = Math.min(1, hint.life / 0.6);
    const alpha = Math.min(fadeIn, fadeOut);
    const { world } = state;
    const x = world.width / 2;
    const y = Math.max(150, world.height * 0.24);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '900 15px Poppins, sans-serif';
    ctx.textAlign = 'center';

    const paddingX = 20;
    const textWidth = ctx.measureText(hint.text).width;
    const boxWidth = textWidth + paddingX * 2;
    const boxHeight = 44;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.74)';
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.55)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight, 999);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e0f2fe';
    ctx.fillText(hint.text, x, y + 5);
    ctx.restore();
}
