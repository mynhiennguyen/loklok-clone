import { store } from "@/store";
import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";

export class UserIdAssignmentAction extends Action {

    constructor(private readonly userData: Record<string,string>, canvas: CanvasUI, ws: WebSocket) {
        super(canvas, ws);
    }
    override execute(): void {
        if(store.state.userId !== "NO_ID") return; // if ID is already set, ignore
        store.commit("setUserId", this.userData.id);
        
    }
    override recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth?: number): void {
        throw new Error("Method not implemented.");
    }

    override saveAction() {
        // do nothing
    }

}
