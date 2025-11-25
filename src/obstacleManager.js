import { Obstacle } from './obstacle.js';
import { CONFIG } from './game.js';

export class ObstacleManager {
  constructor() {
    this.obstacles = [];
    this.lastSpawnX = 0;
  }

  update() {
    this.obstacles.forEach(obs => obs.update());
    this.obstacles = this.obstacles.filter(obs => obs.x + obs.width > 0);

    this.lastSpawnX += CONFIG.scrollSpeed;
    if (this.lastSpawnX > CONFIG.obstacleSpacing) {
      this.spawnObstacle();
      this.lastSpawnX = 0;
    }
  }

  spawnObstacle() {
    const type = Math.random() < 0.5 ? "spike" : "block";
    const width = type === "spike" ? 20 : 50;
    const height = type === "spike" ? 20 : 50;
    const y = CONFIG.canvasHeight - height;
    const obs = new Obstacle(type, CONFIG.canvasWidth, y, width, height);
    this.obstacles.push(obs);
  }

  draw(ctx) {
    this.obstacles.forEach(obs => obs.draw(ctx));
  }
}
