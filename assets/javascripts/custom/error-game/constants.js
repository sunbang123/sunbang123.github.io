// Tunable numbers for the 404 runner game. Kept separate from logic so
// difficulty/feel can be adjusted without touching behavior code.

export const GRAVITY = 2250;
export const JUMP_POWER = -790;
export const DOUBLE_JUMP_POWER = -640;
export const STAND_HEIGHT = 62;
export const DUCK_HEIGHT = 34;
export const PLAYER_WIDTH = 58;
export const FAST_FALL_VELOCITY = 480;
export const FAST_FALL_GRAVITY_MULTIPLIER = 1.5;

export const SHIELD_SIGNAL_THRESHOLD = 5;
export const MAX_SHIELD = 3;
export const SHIELD_ATTACK_THRESHOLD = 3;
export const COMBO_WINDOW = 1.4;

export const GHOST_SPEED_THRESHOLD = 650;
export const GHOST_LIFETIME = 9;
export const GHOST_HOMING_RATE = 4.2;
export const GHOST_CHASE_GAP_START = 200;
export const GHOST_CHASE_GAP_END = 60;
export const GHOST_WIDTH = 54;
export const GHOST_HEIGHT = 54;
export const GHOST_DASH_FIRST_DELAY_MIN = 1.4;
export const GHOST_DASH_FIRST_DELAY_MAX = 2.2;
export const GHOST_DASH_INTERVAL_MIN = 2.6;
export const GHOST_DASH_INTERVAL_MAX = 3.8;
export const GHOST_TELEGRAPH_TIME = 0.45;
export const GHOST_DASH_TIME = 0.22;
export const GHOST_DASH_RECOVER = 0.55;
export const GHOST_DASH_OVERSHOOT = 1.6;
export const GHOST_MISS_FLY_TIME = 0.5;
export const GHOST_MISS_SPEED_MULTIPLIER = 1.5;

// Slam attack: ducking mid-air (a committed ground pound) lets the player
// stomp the ghost instead of taking a hit. The ghost is knocked to the
// ground and stays there, dazed, until touched (reward) or its time runs out.
export const GHOST_FALLEN_GRAVITY = 1600;
export const GHOST_FALLEN_BOUNCE_VY = -420;
export const GHOST_FALLEN_LIFETIME = 3.5;
export const SLAM_SIGNAL_REWARD = 2;

export const SCORE_STORAGE_KEY = 'error-runner-best';
export const SIGNAL_STORAGE_KEY = 'error-runner-best-signals';
export const SHIELD_HINT_STORAGE_KEY = 'error-runner-shield-hint-seen';

export const groundObstacleTypes = [
    { kind: 'file', label: '404', width: 56, height: 54, color: '#f8fafc', accent: '#dc2626' },
    { kind: 'file', label: 'NULL', width: 58, height: 48, color: '#e2e8f0', accent: '#64748b' },
    { kind: 'server', label: '500', width: 46, height: 78, color: '#fecaca', accent: '#ef4444' },
    { kind: 'dns', label: 'DNS?', width: 64, height: 52, color: '#bae6fd', accent: '#0284c7' },
    { kind: 'loop', label: 'LOOP', width: 66, height: 66, color: '#ddd6fe', accent: '#7c3aed' },
    { kind: 'timeout', label: 'TIMEOUT', width: 74, height: 44, color: '#fed7aa', accent: '#ea580c' },
    { kind: 'broken-link', label: 'LINK', width: 70, height: 50, color: '#bbf7d0', accent: '#16a34a' }
];

export const flyObstacleTypes = [
    { kind: 'flying', label: 'POPUP', width: 60, height: 40, color: '#fee2e2', accent: '#dc2626' },
    { kind: 'flying', label: 'SPAM', width: 64, height: 38, color: '#fef3c7', accent: '#d97706' },
    { kind: 'flying', label: 'COOKIE?', width: 74, height: 40, color: '#ede9fe', accent: '#7c3aed' }
];
