import { CONFIG } from './game.js';

export class CorridorEvent {
  constructor(question) {
    this.lanes = [];
    this.question = question;
    const laneHeight = CONFIG.canvasHeight / CONFIG.laneCount;
    question.answers.forEach((ans, i) => {
      this.lanes.push({
        x: 0,
        y: i * laneHeight,
        width: CONFIG.canvasWidth,
        height: laneHeight,
        text: ans,
        isCorrect: i === question.correct
      });
    });
    this.active = true;
  }

  checkCollision(player) {
    for (const lane of this.lanes) {
      const a = { x: player.x, y: player.y, width: player.width, height: player.height };
      const b = lane;
      const collision = (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
      if (collision && !lane.isCorrect) return true;
    }
    return false;
  }

  draw(ctx) {
    this.lanes.forEach(lane => {
      ctx.fillStyle = lane.isCorrect ? "#b0f0b0" : "#f0b0b0";
      ctx.fillRect(lane.x, lane.y, lane.width, lane.height);
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(lane.text, lane.x + 20, lane.y + lane.height / 2 + 5);
    });
  }

  update() {
    // optional: move corridor obstacles if needed
  }
}
