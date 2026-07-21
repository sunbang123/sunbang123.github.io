// Small canvas/DOM helpers shared across draw modules. No game state here.

export function roundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
}

export function collide(a, b) {
    return (
        a.x + 7 < b.x + b.width &&
        a.x + a.width - 7 > b.x &&
        a.y + 5 < b.y + b.height &&
        a.y + a.height - 2 > b.y
    );
}

export function isLightTheme() {
    return document.documentElement.dataset.theme === 'light';
}
