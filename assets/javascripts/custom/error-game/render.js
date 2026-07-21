import { roundRect, isLightTheme } from './draw-utils.js';
import { STAND_HEIGHT } from './constants.js';

export function drawBackground(ctx, state) {
    const { world, distance, mode, speed } = state;
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

    if (mode === 'running') {
        const intensity = Math.max(0, Math.min(1, (speed - 390) / (720 - 390)));
        if (intensity > 0.05) {
            const vignette = ctx.createRadialGradient(
                world.width / 2, world.height / 2, world.height * 0.25,
                world.width / 2, world.height / 2, world.height * 0.75
            );
            vignette.addColorStop(0, 'rgba(239, 68, 68, 0)');
            vignette.addColorStop(1, `rgba(239, 68, 68, ${0.16 * intensity})`);
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, world.width, world.height);
        }
    }
}

export function drawPlayer(ctx, state) {
    const { player, distance, elapsed, invulnTime, shieldCount } = state;
    const x = player.x;
    const y = player.y;
    const run = Math.sin(distance * 0.08) * 3;
    const bob = player.grounded ? Math.sin(distance * 0.045) * 1.8 : -2;
    const squish = player.ducking ? player.height / STAND_HEIGHT : 1;
    const invulnBlink = invulnTime > 0 && Math.floor(elapsed * 16) % 2 === 0;

    ctx.save();
    ctx.translate(x, y + bob);

    if (shieldCount > 0 && !player.fastFalling) {
        const pulse = 3 + Math.sin(distance * 0.02) * 2;
        ctx.strokeStyle = 'rgba(103, 232, 249, 0.65)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(29, 31 * squish, 34 + pulse, 0, Math.PI * 2);
        ctx.stroke();
    }

    if (invulnBlink) ctx.globalAlpha = 0.35;

    ctx.scale(1, squish);

    ctx.strokeStyle = 'rgba(167, 243, 208, 0.34)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(43, 15);
    ctx.quadraticCurveTo(64, 4, 70, 24);
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(72, 25, 4.5, 0, Math.PI * 2);
    ctx.fill();

    roundRect(ctx, 4, 7, 50, 43, 9);
    ctx.fillStyle = '#a7f3d0';
    ctx.fill();

    roundRect(ctx, 10, 14, 38, 25, 5);
    ctx.fillStyle = '#052e2b';
    ctx.fill();

    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(17, 23, 6, 5);
    ctx.fillRect(34, 23, 6, 5);

    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(18, 34);
    ctx.lineTo(27, 34);
    ctx.lineTo(31, 31);
    ctx.lineTo(40, 31);
    ctx.stroke();

    ctx.fillStyle = '#052e2b';
    ctx.fillRect(16, 50, 8, 10 + run);
    ctx.fillRect(36, 50, 8, 10 - run);

    ctx.fillStyle = '#a7f3d0';
    ctx.fillRect(12, 60 + run, 15, 4);
    ctx.fillRect(32, 60 - run, 15, 4);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 11px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('</>', 29, 4);

    ctx.restore();
}

export function drawIdleMark(ctx, state) {
    const { world } = state;
    ctx.fillStyle = isLightTheme() ? 'rgba(15, 23, 42, 0.08)' : 'rgba(248, 250, 252, 0.14)';
    ctx.font = `900 ${Math.min(180, world.width * 0.18)}px Poppins, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText('404', world.width - 34, Math.max(130, world.height * 0.26));
}
