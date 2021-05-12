import { store } from "@/store";
import { DrawingAction, ErasingAction } from "./action";
import { Action } from "./interfaces/action";
import { CanvasUI } from "./interfaces/canvas";

export abstract class InputState {
    canvas: CanvasUI;
    isActionActive = false;
    currentAction: Action = null;
    x = 0;
    y = 0;
    ws: WebSocket = null

    constructor(canvas: CanvasUI, ws: WebSocket) {
        this.canvas = canvas
        this.ws = ws
    }

    abstract startAction(e: PointerEvent, tpCache?: PointerEvent[]): void
    abstract continueAction(e: PointerEvent, tpCache?: PointerEvent[]): void
    abstract endAction(e: PointerEvent, tpCache?: PointerEvent[]): Action
}

export class DrawingState extends InputState {
    startAction(e: PointerEvent): void {
        this.isActionActive = true;
        this.x = e.offsetX;
        this.y = e.offsetY;
        //init new DrawingAction
        if (this.currentAction == null) {
            this.currentAction = new DrawingAction(store.state.lineColor, store.state.lineThickness, this.canvas, this.ws);
        }
    }
    continueAction(e: PointerEvent): void {
        if (this.isActionActive && this.currentAction !== null) {
            //executes drawing and records all points
            this.currentAction.recordAndExecute(
                this.x,
                this.y,
                e.offsetX,
                e.offsetY,
                store.state.lineThickness
            );
            this.x = e.offsetX;
            this.y = e.offsetY;
        }
    }
    endAction(e: PointerEvent): Action {
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

export class ErasingState extends DrawingState {
    
    startAction(e: PointerEvent): void {
        this.isActionActive = true;
        this.x = e.offsetX;
        this.y = e.offsetY;
        //init new DrawingAction
        if (this.currentAction == null) {
            this.currentAction = new ErasingAction(store.state.lineThickness, this.canvas, this.ws);
        }
    }
}

export class TouchErasingState extends InputState {

    startAction(e: PointerEvent, tpCache: PointerEvent[]): void {
        this.isActionActive = true;
    const point1 = tpCache[0];
    const point2 = tpCache[1];

    this.x = (point1.offsetX + point2.offsetX) / 2;
    this.y = (point1.offsetY + point2.offsetY) / 2;

    this.currentAction = new ErasingAction(this.calculateLineWidth(point1, point2), this.canvas, this.ws);
    }

    continueAction(e: PointerEvent, tpCache: PointerEvent[]): void {
        if (this.isActionActive && this.currentAction !== null) {
            const point1 = tpCache[0];
            const point2 = tpCache[1];

            const newX = (point1.offsetX + point2.offsetX) / 2;
            const newY = (point1.offsetY + point2.offsetY) / 2;
            
            //executes drawing and records all points
            this.currentAction.recordAndExecute(
              this.x,
              this.y,
              e.offsetX,
              e.offsetY,
              this.calculateLineWidth(tpCache[0], tpCache[1])
            );
            this.x = e.offsetX;
            this.y = e.offsetY;
          }
    }
    endAction(e: PointerEvent, tpCache: PointerEvent[]): Action {
        let finishedAction: Action = null;
        if (this.isActionActive && this.currentAction !== null) {
            this.currentAction.recordAndExecute(
                this.x,
                this.y,
                e.offsetX,
                e.offsetY,
                this.calculateLineWidth(tpCache[0], tpCache[1])
            );
            finishedAction = this.currentAction;
            this.currentAction = null;
            this.isActionActive = false;
        }
        return finishedAction;
    }

    private calculateLineWidth(point1: PointerEvent, point2: PointerEvent): number {
        //TODO: dynamic linewidth
        // const a = this.x - point1.offsetX;
        // const b = this.y - point1.offsetY;
        // console.log(Math.hypot(a, b))
        // return Math.hypot(a, b);
    
        return Math.abs(point1.offsetX - point2.offsetX);
      }

}