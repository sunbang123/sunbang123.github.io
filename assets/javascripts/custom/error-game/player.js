import { STAND_HEIGHT, DUCK_HEIGHT, FAST_FALL_VELOCITY } from './constants.js';

export function placePlayerOnGround(state) {
    const { player, world } = state;
    player.x = Math.max(92, Math.min(158, world.width * 0.14));
    player.y = world.groundY - player.height;
}

export function setDucking(state, value) {
    const { player } = state;
    if (state.mode !== 'running' || player.ducking === value) return;

    const prevBottom = player.y + player.height;
    player.ducking = value;
    player.height = value ? DUCK_HEIGHT : STAND_HEIGHT;
    player.y = prevBottom - player.height;

    // Ducking while airborne is a committed fast-fall (ground pound):
    // an immediate downward snap, then extra gravity keeps it fast
    // until landing. Also cancels the spare double jump - you're
    // dropping, not still trying to get higher.
    if (value && !player.grounded) {
        player.vy = Math.max(player.vy, FAST_FALL_VELOCITY);
        player.jumpsUsed = 2;
        player.fastFalling = true;
    }
}
