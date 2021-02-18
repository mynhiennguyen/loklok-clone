import { DrawingAction } from "./drawingAction";
import { Action } from "./interfaces/action";
import { Canvas } from "./interfaces/canvas";

export class ActionHandler {
  canvas: Canvas;
  isActionActive = false;
  currentAction: Action = null;
  x = 0;
  y = 0;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  beginDrawing(e: PointerEvent): void {
    this.isActionActive = true;
    this.x = e.offsetX;
    this.y = e.offsetY;
    //init new DrawingAction
    if (this.currentAction == null) {
      this.currentAction = new DrawingAction("black", 1, this.canvas);
    }
  }

  draw(e: PointerEvent): void {
    if (this.isActionActive && this.currentAction !== null) {
      //executes drawing and records all points
      this.currentAction.recordAndExecute(
        this.x,
        this.y,
        e.offsetX,
        e.offsetY
      );
      this.x = e.offsetX;
      this.y = e.offsetY;
    }
  }

  stopDrawing(e: PointerEvent): Action {
    let finishedAction: Action = null;
    if (this.isActionActive && this.currentAction !== null) {
      this.currentAction.recordAndExecute(
        this.x,
        this.y,
        e.offsetX,
        e.offsetY
      );
      finishedAction = this.currentAction;
      this.currentAction = null;
      this.isActionActive = false;
    }
    return finishedAction;
  }
}