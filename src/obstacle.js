import { CONFIG } from './game.js';

export class Obstacle {
  constructor(type, x, y, width, height) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update() {
    this.x -= CONFIG.scrollSpeed;
  }

  getHitbox() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  draw(ctx) {
    ctx.fillStyle = this.type === "spike" ? "red" : "gray";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
