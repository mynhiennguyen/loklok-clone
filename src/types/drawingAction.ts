import { Action } from "./interfaces/action";

export class DrawingAction implements Action {
    ctx: CanvasRenderingContext2D //Canvas to be drawn on
    points: [number, number][] = [] //All points that make up the drawing

    constructor(strokeStyle: string, lineWidth: number, ctx: CanvasRenderingContext2D){
        this.ctx = ctx
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.lineWidth = lineWidth;
    }

    execute(){
        //draws all segments according to recorded points
        for(let i = 0; i < this.points.length - 2; i++){
            this.drawSegment(this.points[i][0], this.points[i][1], this.points[i+1][0], this.points[i+1][1])
        }
    }

    recordAndDrawSegment(x1: number, y1: number, x2: number, y2: number){
        //record path
        this.points.push([x1, y1]) //TODO: there will be duplicate points, optimize
        this.points.push([x2, y2])

        //draw line onto canvas
        this.drawSegment(x1,y1,x2,y2)
    }

    private drawSegment(x1: number, y1: number, x2: number, y2: number){
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}
