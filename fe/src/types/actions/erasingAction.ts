import { store } from '../../store';
import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";
import { Message, MessageType } from "../messages/message";


export class ErasingAction extends Action {
    points: [number, number][] = []; //All points that make up the drawing
    lineWidth: number;

    constructor(lineWidth: number, canvas: CanvasUI, ws: WebSocket) {
        super(canvas, ws);
        this.lineWidth = lineWidth;
    }

    override execute() {
        //draws all segments according to recorded points
        for (let i = 0; i < this.points.length - 2; i++) {
            this.canvas.eraseLine(this.points[i][0], this.points[i][1], this.points[i + 1][0], this.points[i + 1][1], this.lineWidth);
        }
    }

    override recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth: number) {
        //record path
        this.points.push([x1, y1]); //TODO: there will be duplicate points, optimize
        this.points.push([x2, y2]);

        this.lineWidth = lineWidth;

        //draw line onto canvas
        this.canvas.eraseLine(x1, y1, x2, y2, this.lineWidth);

        //send via websocket
        const data = { points: [x1, y1, x2, y2], lineWidth: this.lineWidth }
        const msg: Message = new Message(MessageType.Erasing, data, store.getters.userId)
        this.ws.send(JSON.stringify(msg))
    }

    override saveAction() {
        const pathObj = {
            type: 'finishedErasingAction',
            points: JSON.stringify(this.points),
            lineWidth: this.lineWidth
        };

        this.ws.send(JSON.stringify(pathObj));
    }
}
