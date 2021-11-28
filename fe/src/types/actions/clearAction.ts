import { store } from "@/store";
import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";
import { Message, MessageType } from "../messages/message";


export class ClearAction extends Action {

    constructor(canvas: CanvasUI, ws: WebSocket) {
        super(canvas, ws);
    }
    override execute(): void {
        this.canvas.clear();
        // send action via WS
        const msg = new Message(MessageType.Clear, null, store.state.userId)
        this.ws.send(JSON.stringify(msg))
        
    }
    override recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth?: number): void {
        throw new Error("Method not implemented.");
    }

    override saveAction() {
        const pathObj = {
            type: 'clearAction',
        };

        this.ws.send(JSON.stringify(pathObj));
    }

}
