import { ErasingAction } from "../actions/erasingAction";
import { Action } from "../interfaces/action";
import { InputState } from "../interfaces/inputState";


export class TouchErasingState extends InputState {

    override startAction(e: PointerEvent, tpCache: PointerEvent[]): void {
        this.isActionActive = true;
        const point1 = tpCache[0];
        const point2 = tpCache[1];

        this.x = (point1.offsetX + point2.offsetX) / 2;
        this.y = (point1.offsetY + point2.offsetY) / 2;

        if (this.currentAction == null) {
            const data: Record<string, number> = {
                strokeWidth: this.calculateLineWidth(point1, point2)
            }
            this.currentAction = new ErasingAction(data, this.canvas, this.ws);
        }
    }

    override continueAction(e: PointerEvent, tpCache: PointerEvent[]): void {
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
    override endAction(e: PointerEvent, tpCache: PointerEvent[]): Action {
        let finishedAction: Action = null as any;
        if (this.isActionActive && this.currentAction !== null) {
            this.currentAction.recordAndExecute(
                this.x,
                this.y,
                e.offsetX,
                e.offsetY,
                this.calculateLineWidth(tpCache[0], tpCache[1])
            );
            finishedAction = this.currentAction;
            this.currentAction = null as any;
            this.isActionActive = false;
        }
        finishedAction.saveAction();
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
