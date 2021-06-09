import { store } from "@/store";
import { ErasingAction } from "../actions/erasingAction";
import { DrawingState } from "./DrawingState";


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
