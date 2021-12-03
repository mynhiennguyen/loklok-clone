import { store } from "@/store";
import { ErasingAction } from "../actions/erasingAction";
import { DrawingState } from "./DrawingState";


export class ErasingState extends DrawingState {

    override startAction(e: PointerEvent): void {
        this.isActionActive = true;
        this.x = e.offsetX;
        this.y = e.offsetY;
        //init new DrawingAction
        if (this.currentAction == null) {
            const data: Record<string, number> = {
                strokeWidth: store.state.lineThickness
            }
            this.currentAction = new ErasingAction(data, this.canvas, this.ws);
        }
    }
}
