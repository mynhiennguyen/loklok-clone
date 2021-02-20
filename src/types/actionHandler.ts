import { DrawingAction, ErasingAction } from "./drawingAction";
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
      this.currentAction = new DrawingAction("black", 10, this.canvas);
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

  startErasing(e: PointerEvent, tpCache: PointerEvent[]): void {
    this.isActionActive = true;
    const point1 = tpCache[0];
    const point2 = tpCache[1];

    this.x = (point1.offsetX + point2.offsetX) / 2; 
    this.y = (point1.offsetY + point2.offsetY) / 2;
    
    this.currentAction = new ErasingAction(this.calculateLineWidth(point1), this.canvas);
  }

  erase(e: PointerEvent, tpCache: PointerEvent[]): void {
    if (this.isActionActive && this.currentAction !== null) {
      //executes drawing and records all points
      this.currentAction.recordAndExecute(
        this.x,
        this.y,
        e.offsetX,
        e.offsetY,
        this.calculateLineWidth(tpCache[0])
      );
      this.x = e.offsetX;
      this.y = e.offsetY;
    }
  }

  private calculateLineWidth(point1): number{
    //linewidth
    const BUFFER = 5;
    const a = this.x - point1.offsetX;
    const b = this.y - point1.offsetY;
    return Math.hypot(a, b);
  }
}