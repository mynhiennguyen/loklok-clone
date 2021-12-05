import { store } from "@/store";
import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";

export class UndoRedoAvailabilitiesAction extends Action {
    constructor(private readonly data: Record<string, any>, canvas: CanvasUI, ws: WebSocket) {
        super(canvas, ws);
    }
    override execute(canvasComponent: any): void {
        canvasComponent.setIsUndoRedoActive(this.data.isUndoAvailable, this.data.isRedoAvailable)
    }
    override recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth?: number): void {
        throw new Error("Method not implemented.");
    }

    override saveAction() {
        // do nothing
    }

}
