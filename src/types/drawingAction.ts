import { Action } from "./interfaces/action";
import { Canvas } from "./interfaces/canvas";

export class DrawingAction implements Action {
    canvas: Canvas //Canvas to be drawn on
    points: [number, number][] = [] //All points that make up the drawing
    strokeStyle: string;
    lineWidth: number;

    constructor(strokeStyle: string, lineWidth: number, canvas: Canvas){
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

    recordAndExecute(x1: number, y1: number, x2: number, y2: number){
        //record path
        this.points.push([x1, y1]) //TODO: there will be duplicate points, optimize
        this.points.push([x2, y2])

        //draw line onto canvas
        this.canvas.drawLine(x1,y1,x2,y2, this.strokeStyle, this.lineWidth)
    }
}
