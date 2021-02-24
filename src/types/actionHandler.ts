import { DrawingAction, ErasingAction } from "./drawingAction";
import { Action } from "./interfaces/action";
import { CanvasUI } from "./interfaces/canvas";

export class ActionHandler {
  canvas: CanvasUI;
  isActionActive = false;
  currentAction: Action = null;
  x = 0;
  y = 0;
  touchPointCache: PointerEvent[] = [];

  constructor(canvas: CanvasUI) {
    this.canvas = canvas;
  }

  startNewAction(e: PointerEvent): void {
    e.preventDefault();

    if (e.pointerType == "touch") {
      this.touchPointCache.push(e);
    }
    if (this.touchPointCache.length == 2) {
      this.startErasing(e, this.touchPointCache);
    }
    else {
      this.beginDrawing(e);
    }
  }

  continueAction(e: PointerEvent): void {
    e.preventDefault();
    if (this.touchPointCache.length == 2) {
      document.getElementById("toolbar").style.backgroundColor = "blue";
      this.erase(e, this.touchPointCache);
    } else {
      this.draw(e);
    }
  }

  endAction(e: PointerEvent): Action {
    e.preventDefault();

    if (e.pointerType == "touch") {
      //remove from cache
      this.touchPointCache = this.touchPointCache.filter(x => x.pointerId !== e.pointerId)
    }
    if (this.touchPointCache.length <= 1) {
      document.getElementById("toolbar").style.backgroundColor = "sandybrown";
    }

    return this.stopDrawing(e);
  }

  private beginDrawing(e: PointerEvent): void {
    this.isActionActive = true;
    this.x = e.offsetX;
    this.y = e.offsetY;
    //init new DrawingAction
    if (this.currentAction == null) {
      this.currentAction = new DrawingAction("black", 10, this.canvas);
    }
  }

  private draw(e: PointerEvent): void {
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

  private stopDrawing(e: PointerEvent): Action {
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

  private startErasing(e: PointerEvent, tpCache: PointerEvent[]): void {
    this.isActionActive = true;
    const point1 = tpCache[0];
    const point2 = tpCache[1];

    this.x = (point1.offsetX + point2.offsetX) / 2;
    this.y = (point1.offsetY + point2.offsetY) / 2;

    this.currentAction = new ErasingAction(this.calculateLineWidth(point1), this.canvas);
  }

  private erase(e: PointerEvent, tpCache: PointerEvent[]): void {
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

  private calculateLineWidth(point1: PointerEvent): number {
    //linewidth
    const BUFFER = 5;
    const a = this.x - point1.offsetX;
    const b = this.y - point1.offsetY;
    return Math.hypot(a, b);
  }
}