import { jump, revealGame } from './game-flow.js';
import { setDucking } from './player.js';

export function wireInput(state) {
    const e = state.elements;

    e.startButton.addEventListener('click', () => jump(state));

    e.canvas.addEventListener('pointerdown', () => {
        if (state.mode === 'idle') return;
        jump(state);
    });

    if (e.touchJumpButton) {
        e.touchJumpButton.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            jump(state);
        });
    }

    if (e.touchDuckButton) {
        e.touchDuckButton.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            state.duckPointerId = event.pointerId;
            setDucking(state, true);
        });

        const releaseTouchDuck = (event) => {
            if (state.duckPointerId !== null && (!event || event.pointerId === state.duckPointerId)) {
                state.duckPointerId = null;
                setDucking(state, false);
            }
        };

        e.touchDuckButton.addEventListener('pointerup', releaseTouchDuck);
        e.touchDuckButton.addEventListener('pointercancel', releaseTouchDuck);
        e.touchDuckButton.addEventListener('pointerleave', releaseTouchDuck);
    }

    e.root.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        revealGame(state);
    });

    window.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || event.code === 'ArrowUp') {
            event.preventDefault();
            jump(state);
            return;
        }

        if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            event.preventDefault();
            setDucking(state, true);
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            setDucking(state, false);
        }
    });
}
