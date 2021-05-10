import { Action } from "./interfaces/action";
import { CanvasUI } from "./interfaces/canvas";

export class DrawingAction implements Action {
    canvas: CanvasUI //Canvas to be drawn on
    points: [number, number][] = [] //All points that make up the drawing
    strokeStyle: string;
    lineWidth: number;

    constructor(strokeStyle: string, lineWidth: number, canvas: CanvasUI){
        this.canvas = canvas
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
    }
}

export class ErasingAction implements Action {
    canvas: CanvasUI //Canvas to be drawn on
    points: [number, number][] = [] //All points that make up the drawing
    lineWidth: number;

    constructor(lineWidth: number, canvas: CanvasUI){
        this.canvas = canvas
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

export class ClearAction implements Action {
    canvas: CanvasUI

    constructor(canvas: CanvasUI){
        this.canvas = canvas;
    }
    execute(): void {
        this.canvas.clear()
    }
    recordAndExecute(x1: number, y1: number, x2: number, y2: number, lineWidth?: number): void {
        throw new Error("Method not implemented.");
    }
    
}
