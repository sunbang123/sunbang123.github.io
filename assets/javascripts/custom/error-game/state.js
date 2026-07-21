import {
    PLAYER_WIDTH,
    STAND_HEIGHT,
    SCORE_STORAGE_KEY,
    SIGNAL_STORAGE_KEY,
    SHIELD_HINT_STORAGE_KEY
} from './constants.js';

// A single mutable object holds every piece of run state. Modules receive
// it as a plain parameter and read/write its fields directly - this keeps
// the split into files mechanical (no getters/setters) while still letting
// every module share the same live data.
export function createState(elements) {
    return {
        elements,

        mode: 'idle',
        lastTime: 0,
        distance: 0,
        elapsed: 0,
        score: 0,
        bonusScore: 0,
        signals: 0,
        speed: 390,
        nextObstacle: 0,
        nextSignal: 0,

        obstacles: [],
        collectibles: [],
        particles: [],
        floatingTexts: [],
        bannerHint: null,

        best: Number(localStorage.getItem(SCORE_STORAGE_KEY) || 0),
        bestSignals: Number(localStorage.getItem(SIGNAL_STORAGE_KEY) || 0),
        secretClicks: 0,

        comboStreak: 0,
        lastSignalTime: -Infinity,
        shieldProgress: 0,
        shieldCount: 0,
        invulnTime: 0,
        // Shown once, ever - not reset between runs.
        shieldHintShown: localStorage.getItem(SHIELD_HINT_STORAGE_KEY) === '1',

        shakeTime: 0,
        shakeDuration: 0,
        shakeMag: 0,

        ghost: null,
        ghostCooldown: 3,

        duckPointerId: null,

        world: {
            width: 1440,
            height: 720,
            groundY: 590,
            viewportZoom: 1
        },

        player: {
            x: 148,
            y: 0,
            width: PLAYER_WIDTH,
            height: STAND_HEIGHT,
            vy: 0,
            grounded: true,
            ducking: false,
            jumpsUsed: 0,
            fastFalling: false
        }
    };
}

export function saveBest(state) {
    localStorage.setItem(SCORE_STORAGE_KEY, String(state.best));
}

export function saveBestSignals(state) {
    if (state.signals <= state.bestSignals) return;
    state.bestSignals = state.signals;
    localStorage.setItem(SIGNAL_STORAGE_KEY, String(state.bestSignals));
}

export function markShieldHintShown(state) {
    if (state.shieldHintShown) return;
    state.shieldHintShown = true;
    localStorage.setItem(SHIELD_HINT_STORAGE_KEY, '1');
}
