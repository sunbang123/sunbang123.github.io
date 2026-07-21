// Pure scoring-combo formula, split out so both HUD display and the
// scoring logic can use the exact same number without importing each other.

export function comboMultiplier(state) {
    if (state.comboStreak <= 1) return 1;
    return Math.min(5, 1 + Math.floor((state.comboStreak - 1) / 2));
}
