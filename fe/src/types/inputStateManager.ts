import { Action } from "./interfaces/action";
import { CanvasUI } from "./interfaces/canvas";
import { store } from "../store";
import { Tool } from "@/options";
import { InputState } from "./interfaces/inputState";
import { TouchErasingState } from "./inputStates/TouchErasingState";
import { ErasingState } from "./inputStates/ErasingState";
import { DrawingState } from "./inputStates/DrawingState";

/**
 * Sets the InputState of the application according to selected Tool or Touch-Input (e.g. Multi-touch erasing)
 */
export class InputStateManager {
  canvas: CanvasUI;
  isActionActive = false;
  x = 0;
  y = 0;
  touchPointCache: PointerEvent[] = [];
  inputState: InputState;
  ws: WebSocket;

  constructor(canvas: CanvasUI, ws: WebSocket) {
    this.canvas = canvas;
    this.ws = ws;
    this.inputState = new DrawingState(this.canvas, this.ws);
  }

  startNewAction(e: PointerEvent): void {
    e.preventDefault();
    if (e.pointerType == "touch") {
      this.touchPointCache.push(e);
    }
    if (store.state.tool == Tool.ERASER) {
      this.inputState = new ErasingState(this.canvas, this.ws);
    } else if (store.state.tool == Tool.PENCIL) {
      this.inputState = new DrawingState(this.canvas, this.ws);
    }
    if (this.touchPointCache.length == 2) {
      this.inputState = new TouchErasingState(this.canvas, this.ws);
    }

    this.inputState.startAction(e, this.touchPointCache);
  }

  continueAction(e: PointerEvent): void {
    e.preventDefault();
    this.inputState.continueAction(e, this.touchPointCache);
  }

  endAction(e: PointerEvent): Action {
    e.preventDefault();

    if (e.pointerType == "touch") {
      //remove from cache
      this.touchPointCache = this.touchPointCache.filter(
        (x) => x.pointerId !== e.pointerId
      );
    }
    return this.inputState.endAction(e, this.touchPointCache);
  }
}
