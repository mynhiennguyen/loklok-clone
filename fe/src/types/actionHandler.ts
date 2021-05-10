import { Action } from "./interfaces/action";
import { CanvasUI } from "./interfaces/canvas";
import { store } from "../store";
import { Tool } from "@/options";
import { DrawingState, ErasingState, InputState, TouchErasingState } from "./InputState";

export class ActionHandler {
  canvas: CanvasUI;
  isActionActive = false;
  currentAction: Action = null;
  x = 0;
  y = 0;
  touchPointCache: PointerEvent[] = [];
  inputState: InputState = null;

  constructor(canvas: CanvasUI) {
    this.canvas = canvas;
    this.inputState = new DrawingState(this.canvas);
  }

  startNewAction(e: PointerEvent): void {
    e.preventDefault();
    if (e.pointerType == "touch") {
      this.touchPointCache.push(e);
    }
    if(store.state.tool == Tool.ERASER){
      this.inputState = new ErasingState(this.canvas)
    }
    else if(store.state.tool == Tool.PENCIL){
      this.inputState = new DrawingState(this.canvas)
    }
    if (this.touchPointCache.length == 2) {
      this.inputState = new TouchErasingState(this.canvas)
    }

    this.inputState.startAction(e, this.touchPointCache)
  }

  continueAction(e: PointerEvent): void {
    e.preventDefault();
    this.inputState.continueAction(e, this.touchPointCache)
  }

  endAction(e: PointerEvent): Action {
    e.preventDefault();

    if (e.pointerType == "touch") {
      //remove from cache
      this.touchPointCache = this.touchPointCache.filter(x => x.pointerId !== e.pointerId)
    }
    return this.inputState.endAction(e, this.touchPointCache)
  }

}