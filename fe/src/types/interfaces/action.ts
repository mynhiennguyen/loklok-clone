import { CanvasUI } from "./canvas";

/**
 * Interface for any Action made on the Canvase, e.g Drawing or Erasing
 */
export abstract class Action {
  canvas: CanvasUI; // Canvas to be drawn on
  ws: WebSocket;

  constructor(canvas: CanvasUI, ws: WebSocket) {
    this.canvas = canvas;
    this.ws = ws;
  }

  abstract execute(): void;
  abstract recordAndExecute(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    lineWidth?: number
  ): void;
  abstract saveAction(): void;
}
