import { Action } from "./interfaces/action";
import { CanvasUI } from "./interfaces/canvas";

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
        this.ws.send(`${x1},${y1},${x2},${y2},${this.strokeStyle},${this.lineWidth}`)
    }
}

export class ErasingAction extends Action {
    points: [number, number][] = [] //All points that make up the drawing
    lineWidth: number;

    constructor(lineWidth: number, canvas: CanvasUI, ws: WebSocket){
        super(canvas, ws)
        this.lineWidth = lineWidth;
    }

    execute(){
        //draws all segments according to recorded points
        for(let i = 0; i < this.points.length - 2; i++){
            this.canvas.eraseLine(this.points[i][0], this.points[i][1], this.points[i+1][0], this.points[i+1][1],this.lineWidth)
        }
    }

    recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth: number){
        //record path
        this.points.push([x1, y1]) //TODO: there will be duplicate points, optimize
        this.points.push([x2, y2])

        this.lineWidth = lineWidth;

        //draw line onto canvas
        this.canvas.eraseLine(x1,y1,x2,y2,this.lineWidth)
    }
}

export class ClearAction extends Action {

    constructor(canvas: CanvasUI, ws: WebSocket){
        super(canvas, ws)
    }
    execute(): void {
        this.canvas.clear()
    }
    recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth?: number): void {
        throw new Error("Method not implemented.");
    }
    
}
