import { Canvas } from "./interfaces/canvas";

export class Canvas2D implements Canvas {
    ctx: CanvasRenderingContext2D = null;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }
    eraseLine(x1: number, y1: number, x2: number, y2: number, lineWidth: number): void {
        this.ctx.lineWidth = lineWidth;
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, strokeStyle: string, lineWidth: number) {
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    clear() {
        this.ctx.clearRect(
            0,
            0,
            this.ctx.canvas.width,
            this.ctx.canvas.height
        );
    }
}