import { CanvasUI } from "./interfaces/canvas";

/**
 * HTML-Canvas based implementation of the CanvasUI-Interface
 */
export class Canvas2D implements CanvasUI {
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
  eraseLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    lineWidth: number
  ): void {
    this.ctx.lineWidth = lineWidth;
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    strokeStyle: string,
    lineWidth: number
  ) {
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  changeBackground(file: File) {
    const background = new Image();
    background.src = URL.createObjectURL(file);
    const ctx = this.ctx;

    // Make sure the image is loaded first otherwise nothing will draw.
    background.onload = function() {
      ctx.drawImage(background, 0, 0, ctx.canvas.width, ctx.canvas.height);
    };
  }
}
