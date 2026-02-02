export class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    update(dt) { /* default: do nothing */ }

    getHitbox() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}