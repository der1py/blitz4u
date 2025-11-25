import { QUESTION_BANK } from './game.js';
import { CorridorEvent } from './corridorEvent.js';
import { CONFIG } from './game.js';

export class QuizManager {
  constructor() {
    this.timer = 0;
    this.currentQuestion = null;
    this.corridorEvent = null;
    this.questionIndex = 0;
  }

  update(deltaTime, player) {
    if (this.corridorEvent) {
      if (this.corridorEvent.checkCollision(player)) return "gameover";
    } else {
      this.timer += deltaTime;
      if (this.timer >= CONFIG.questionDuration) {
        this.currentQuestion = QUESTION_BANK[this.questionIndex % QUESTION_BANK.length];
        this.corridorEvent = new CorridorEvent(this.currentQuestion);
        this.timer = 0;
        this.questionIndex++;
      }
    }
  }

  draw(ctx) {
    if (this.corridorEvent) this.corridorEvent.draw(ctx);
    else if (this.currentQuestion) {
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.fillText(this.currentQuestion.question, 20, 30);
    }
  }
}
