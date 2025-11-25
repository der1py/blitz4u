import { CONFIG } from './game.js';

export class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velY = 0;
    this.onGround = false;
  }

  update(input) {
    if (input.isKeyPressed(" ") && this.onGround) {
      this.velY = CONFIG.jumpVelocity;
      this.onGround = false;
    }
    this.velY += CONFIG.gravity;
    this.y += this.velY;

    if (this.y + this.height >= CONFIG.canvasHeight) {
      this.y = CONFIG.canvasHeight - this.height;
      this.velY = 0;
      this.onGround = true;
    }
  }

  getHitbox() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  checkCollision(other) {
    const a = this.getHitbox();
    const b = other.getHitbox();
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  draw(ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}