import { Player } from './player.js';
import { ObstacleManager } from './obstacleManager.js';
import { QuizManager } from './quizManager.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './inputHandler.js';
import { EASY_STRUCTURES } from './structures.js'; // for debug; remove later
import { QUIZ_STRUCTURE } from './structures.js'; // for debug; remove later

// the ones with todo dont actually do anything lol
const BLOCK_SIZE = 30;
export const CONFIG = {
  blockSize: BLOCK_SIZE,
  canvasWidth: 20 * BLOCK_SIZE,
  canvasHeight: 12 * BLOCK_SIZE,
  gravity: 0.6, // todo
  jumpVelocity: -12, // todo
  scrollSpeed: 240, // todo
  questionDuration: 5000, // todo
  obstacleSpacing: 250, // todo
  laneCount: 4 // todo
};

export const QUESTION_BANK = [
  { question: "What is 2+2?", answers: ["3","4","5","22"], correct: 1 },
  { question: "3*3=?", answers: ["6","9","12","8"], correct: 1 },
  { question: "Capital of France?", answers: ["Berlin","London","Paris","Rome"], correct: 2 },
  { question: "Square root of 16?", answers: ["2","4","8","6"], correct: 1 }
];

export class Game {
  constructor() {
    const canvas = document.getElementById("gameCanvas");
    this.ctx = canvas.getContext("2d");
    canvas.width = CONFIG.canvasWidth;
    canvas.height = CONFIG.canvasHeight;

    // Player setup
    this.player = new Player(3 * CONFIG.blockSize, 10 * CONFIG.blockSize);

    // Input and renderer
    this.input = new InputHandler();
    this.renderer = new Renderer(this.ctx, canvas);

    // Placeholder for obstacles (empty for now)
    // this.obstacles = []; // move to obstacle manager
    this.obstacleManager = new ObstacleManager();

    // Score & game state
    this.score = 0;
    this.lastTime = 0;
    this.gameOver = false;

    // deubug
    // this.obstacleManager._spawnStructure(EASY_STRUCTURES[0]);
    this.obstacleManager._spawnStructure(QUIZ_STRUCTURE[0]);

    // Start loop
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (!this.gameOver) {
      this.update(deltaTime);
      this.draw();
      requestAnimationFrame(this.loop.bind(this));
    } else {
      this.ctx.fillStyle = "black";
      this.ctx.font = "40px Arial";
      this.ctx.fillText(
        "Game Over!",
        CONFIG.canvasWidth / 2 - 100,
        CONFIG.canvasHeight / 2
      );
    }
  }

  update(deltaTime) {

    // handle input
    if (this.input.isKeyPressed(" ") || this.input.isKeyPressed("ArrowUp") || this.input.isMousePressed()) {
        this.player.jump();
    }

    // temp shortcuts
    if (this.input.isKeyPressed("1") || this.input.isKeyPressed("ArrowUp")) {
        this.obstacleManager.spawnObstacle(10, "spike");
    }

    if (this.input.isKeyPressed("2")) {
        this.obstacleManager._spawnStructure(EASY_STRUCTURES[1]);
    }

    if (this.input.isKeyPressed("3")) {
        console.log(this.obstacleManager.obstacles);
    }
    
    // axis separation: handle x and y logic separately

    // update x movement
    this.obstacleManager.update(deltaTime);

    // handle x collisions
    this.obstacleManager.obstacles.forEach(obstacle => {
        if (this.player.collidesWith(obstacle)) {
          switch(obstacle.type) {
            default:
              this.gameOver = true;
              break;
          }

        }
    });

    // update y movement
    this.player.update(deltaTime, this.input);

    // handle y collisions
    this.player.groundBlock = null;
    this.obstacleManager.obstacles.forEach(obstacle => {
        if (this.player.collidesWith(obstacle)) {
          switch(obstacle.type) {
            case 'block':
              if (this.player.vy < 0) {
                this.player.y = obstacle.y + obstacle.height;
                this.player.vy *= -0.2;
              } else {
                this.player.vy = 0; // ensure no downward velocity before player is able to jump
                // TODO add sm similar for slime
                this.player.isOnGround = true;
                this.player.y = obstacle.y - this.player.height;
                this.player.groundBlock = obstacle;
              }
              break;
            case 'spike':
              this.gameOver = true;
              break;
            case 'slime':
              if (this.player.vy < 0) {
                this.player.y = obstacle.y + obstacle.height;
              } else {
                this.player.isOnGround = true;
                this.player.y = obstacle.y - this.player.height;
                this.player.groundBlock = obstacle;
              }
              this.player.vy *= -0.5;
              break;
            default:
          }
        }
    });

    // Endless runner scoring (could increment over time)
    this.score += 0.01 * deltaTime; // simple score per time
    const distance = CONFIG.scrollSpeed * (deltaTime / 1000);
  }

  draw() {
    this.renderer.clear();
    this.renderer.drawPlayer(this.player);
    this.obstacleManager.obstacles.forEach(obstacle => this.renderer.drawObstacle(obstacle));

    // Draw score
    this.renderer.drawScore(Math.floor(this.score));
  }

}