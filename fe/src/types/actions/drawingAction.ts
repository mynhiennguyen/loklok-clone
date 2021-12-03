import { store } from '../../store';
import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";
import { Message, MessageType } from "../messages/message";

export class DrawingAction extends Action {
    points: [number, number][] = [] //All points that make up the drawing
    strokeStyle: string;
    lineWidth: number;

    constructor(data: Record<string, any>, canvas: CanvasUI, ws: WebSocket){
        super(canvas, ws)
        this.points = data.points ?? [] as [number, number][];
        this.strokeStyle = data.strokeStyle as string;
        this.lineWidth = data.lineWidth as number;
    }

    override execute(){
        //draws all segments according to recorded points
        for(let i = 0; i < this.points.length - 2; i++){
            this.canvas.drawLine(this.points[i][0], this.points[i][1], this.points[i+1][0], this.points[i+1][1],this.strokeStyle, this.lineWidth)
        }
    }

    override recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth = 1){
        //record path
        this.points.push([x1, y1]) //TODO: there will be duplicate points, optimize
        this.points.push([x2, y2])

        //draw line onto canvas
        this.canvas.drawLine(x1,y1,x2,y2, this.strokeStyle, this.lineWidth)

        //send via websocket
        const data = { points: [x1, y1, x2, y2], strokeStyle: this.strokeStyle, lineWidth: this.lineWidth }
        const msg: Message = new Message(MessageType.ActiveDrawing, data, store.getters.userId)
        console.log(JSON.stringify(msg))
        this.ws.send(JSON.stringify(msg))
    }

    override saveAction(){
        const data = { points: this.points, strokeStyle: this.strokeStyle, lineWidth: this.lineWidth }
        const msg: Message = new Message(MessageType.CompletedDrawing, data, store.getters.userId)
        this.ws.send(JSON.stringify(msg))
    }
}


