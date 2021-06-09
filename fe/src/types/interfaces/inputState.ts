import { Action } from "./action";
import { CanvasUI } from "./canvas";

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