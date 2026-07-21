import { SHIELD_ATTACK_THRESHOLD } from './constants.js';
import { comboMultiplier } from './combo.js';

export function setLabels(state) {
    const e = state.elements;
    e.scoreLabel.textContent = String(state.score);
    e.bestLabel.textContent = String(state.best);
    e.signalsLabel.textContent = String(state.signals);
    if (e.bestSignalsLabel) e.bestSignalsLabel.textContent = String(state.bestSignals);

    const multiplier = comboMultiplier(state);
    if (e.comboLabel) e.comboLabel.textContent = 'x' + multiplier;
    if (e.comboBadge) e.comboBadge.classList.toggle('is-active', multiplier > 1);

    if (e.shieldLabel) e.shieldLabel.textContent = String(state.shieldCount);
    if (e.shieldBadge) {
        e.shieldBadge.classList.toggle('is-active', state.shieldCount > 0);
        e.shieldBadge.classList.toggle('is-charged', state.shieldCount >= SHIELD_ATTACK_THRESHOLD);
    }
}

export function setOverlay(state, isVisible, stateText, message, title) {
    const e = state.elements;
    e.overlay.classList.toggle('is-hidden', !isVisible);
    if (title) e.titleLabel.textContent = title;
    if (stateText) e.stateLabel.textContent = stateText;
    if (message) e.messageLabel.textContent = message;
}

export function setRetryButton(state, isVisible) {
    state.elements.startButton.hidden = !isVisible;
}
