import { store } from "@/store";
import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";

export class UserSelectedColorAction extends Action {
    activeUsers: string[];

    constructor(data: string[], canvas: CanvasUI, ws: WebSocket) {
        super(canvas, ws);
        this.activeUsers = data;
    }
    override execute(canvasComponent: any): void {
        canvasComponent.setActiveUsers(this.activeUsers);
    }
    override recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth?: number): void {
        throw new Error("Method not implemented.");
    }

    override saveAction() {
        // do nothing
    }

}
