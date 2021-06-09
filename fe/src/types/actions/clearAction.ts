import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";


export class ClearAction extends Action {

    constructor(canvas: CanvasUI, ws: WebSocket) {
        super(canvas, ws);
    }
    execute(): void {
        this.canvas.clear();
    }
    recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth?: number): void {
        throw new Error("Method not implemented.");
    }

    saveAction() {
        const pathObj = {
            type: 'clearAction',
        };

        this.ws.send(JSON.stringify(pathObj));
    }

}
