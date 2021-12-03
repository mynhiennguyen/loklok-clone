import { store } from "@/store";
import { DrawingAction } from "../actions/drawingAction";
import { Action } from "../interfaces/action";
import { InputState } from "../interfaces/inputState";


export class DrawingState extends InputState {
    override startAction(e: PointerEvent): void {
        this.isActionActive = true;
        this.x = e.offsetX;
        this.y = e.offsetY;
        //init new DrawingAction
        if (this.currentAction == null) {
            const data: Record<string, string | number> = {
                strokeStyle: store.state.lineColor,
                lineWidth: store.state.lineThickness
            }
            this.currentAction = new DrawingAction(data, this.canvas, this.ws);
        }
    }
    override continueAction(e: PointerEvent): void {
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
    override endAction(e: PointerEvent): Action {
        let finishedAction: Action = null as any;
        if (this.isActionActive && this.currentAction !== null) {
            this.currentAction.recordAndExecute(
                this.x,
                this.y,
                e.offsetX,
                e.offsetY
            );
            finishedAction = this.currentAction;
            this.currentAction = null as any;
            this.isActionActive = false;
        }
        finishedAction.saveAction();
        return finishedAction;
    }

}
