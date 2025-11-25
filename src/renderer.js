export class Renderer {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPlayer(player) {
    player.draw(this.ctx);
  }

  drawObstacles(obstacles) {
    obstacles.draw(this.ctx);
  }

  drawScore(score) {
    this.ctx.fillStyle = "black";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`Score: ${score}`, 10, 20);
  }

  drawQuiz(quizManager) {
    quizManager.draw(this.ctx);
  }
}
