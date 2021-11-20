import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";
import { MessageType } from "../messages/message";

export class DrawingAction extends Action {
    points: [number, number][] = [] //All points that make up the drawing
    strokeStyle: string;
    lineWidth: number;

    constructor(strokeStyle: string, lineWidth: number, canvas: CanvasUI, ws: WebSocket){
        super(canvas, ws)
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
    }

    execute(){
        //draws all segments according to recorded points
        for(let i = 0; i < this.points.length - 2; i++){
            this.canvas.drawLine(this.points[i][0], this.points[i][1], this.points[i+1][0], this.points[i+1][1],this.strokeStyle, this.lineWidth)
        }
    }

    recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth = 1){
        //record path
        this.points.push([x1, y1]) //TODO: there will be duplicate points, optimize
        this.points.push([x2, y2])

        //draw line onto canvas
        this.canvas.drawLine(x1,y1,x2,y2, this.strokeStyle, this.lineWidth)

        //send via websocket
        const pathObj = {
            type: MessageType.Drawing,
            points: [x1, y1, x2, y2],
            strokeStyle: this.strokeStyle,
            lineWidth: this.lineWidth
        }
        this.ws.send(JSON.stringify(pathObj))
    }

    saveAction(){
        const pathObj = {
            type: 'finishedDrawingAction',
            points: JSON.stringify(this.points),
            strokeStyle: this.strokeStyle,
            lineWidth: this.lineWidth
        }

        this.ws.send(JSON.stringify(pathObj))
    }
}


