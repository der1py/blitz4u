import { Player } from './player.js';
import { ObstacleManager } from './obstacleManager.js';
import { QuizManager } from './quizManager.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './inputHandler.js';

export const CONFIG = {
  canvasWidth: 800,
  canvasHeight: 400,
  gravity: 0.6,
  jumpVelocity: -12,
  scrollSpeed: 4,
  questionDuration: 5000,
  obstacleSpacing: 250,
  laneCount: 4
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
    this.player = new Player(100, CONFIG.canvasHeight - 50, 30, 30);
    this.input = new InputHandler();
    this.obstacles = new ObstacleManager();
    this.quiz = new QuizManager();
    this.renderer = new Renderer(this.ctx, canvas);
    this.score = 0;
    this.lastTime = 0;
    this.gameOver = false;

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
      this.ctx.fillText("Game Over!", CONFIG.canvasWidth / 2 - 100, CONFIG.canvasHeight / 2);
    }
  }

  update(deltaTime) {
    this.player.update(this.input);
    this.obstacles.update();
    const result = this.quiz.update(deltaTime, this.player);
    if (result === "gameover") this.gameOver = true;

    if (this.quiz.corridorEvent && this.quiz.corridorEvent.active) {
      this.score++;
      this.quiz.corridorEvent.active = false;
    }
  }

  draw() {
    this.renderer.clear();
    this.renderer.drawObstacles(this.obstacles);
    this.renderer.drawPlayer(this.player);
    this.renderer.drawQuiz(this.quiz);
    this.renderer.drawScore(this.score);
  }
}