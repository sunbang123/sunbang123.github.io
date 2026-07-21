import { SHIELD_SIGNAL_THRESHOLD, MAX_SHIELD, SHIELD_ATTACK_THRESHOLD, COMBO_WINDOW } from './constants.js';
import { roundRect, collide } from './draw-utils.js';
import { triggerShake, spawnParticles, spawnFloatingText, showBannerHint } from './effects.js';
import { comboMultiplier } from './combo.js';
import { saveBestSignals, markShieldHintShown } from './state.js';

export function spawnSignal(state) {
    const highLane = Math.random() > 0.5;

    state.collectibles.push({
        x: state.world.width + 36,
        y: state.world.groundY - (highLane ? 170 : 126),
        width: 28,
        height: 28,
        taken: false
    });
}

export function drawSignal(ctx, item) {
    const cx = item.x + item.width / 2;
    const cy = item.y + item.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    roundRect(ctx, -13, -13, 26, 26, 5);
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

export function handleCollectibleCollisions(state) {
    const { player } = state;

    for (const item of state.collectibles) {
        if (!collide(player, item)) continue;

        item.taken = true;
        state.signals += 1;
        saveBestSignals(state);

        const withinCombo = state.elapsed - state.lastSignalTime <= COMBO_WINDOW;
        state.comboStreak = withinCombo ? state.comboStreak + 1 : 1;
        state.lastSignalTime = state.elapsed;

        const multiplier = comboMultiplier(state);
        const gained = 25 * multiplier;
        state.bonusScore += gained;

        spawnParticles(state, item.x + item.width / 2, item.y + item.height / 2, '#facc15', 12);
        spawnFloatingText(state, item.x, item.y - 6, multiplier > 1 ? `+${gained} x${multiplier}` : `+${gained}`, '#facc15');

        state.shieldProgress += 1;
        if (state.shieldProgress >= SHIELD_SIGNAL_THRESHOLD && state.shieldCount < MAX_SHIELD) {
            state.shieldProgress -= SHIELD_SIGNAL_THRESHOLD;
            state.shieldCount += 1;

            if (state.shieldCount >= SHIELD_ATTACK_THRESHOLD) {
                spawnFloatingText(state, player.x, player.y - 26, 'SHIELD ATTACK READY!', '#facc15');
                triggerShake(state, 5, 0.2);
            } else {
                spawnFloatingText(state, player.x, player.y - 26, 'SHIELD UP!', '#67e8f9');
                triggerShake(state, 3, 0.15);
            }

            if (!state.shieldHintShown) {
                markShieldHintShown(state);
                showBannerHint(state, 'Collect 5 signals to earn a shield!', 4.5);
            }
        }
    }
}
