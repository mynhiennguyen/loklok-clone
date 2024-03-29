import { store } from "@/store";
import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";

export class ClearAction extends Action {
    constructor(canvas: CanvasUI, ws: WebSocket) {
        super(canvas, ws);
    }
    override execute(): void {
        this.canvas.clear();
    }
    override recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth?: number): void {
        throw new Error("Method not implemented.");
    }

    override saveAction() {
        // do nothing
    }

}
