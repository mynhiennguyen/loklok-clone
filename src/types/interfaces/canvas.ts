export interface Canvas {
    drawLine(x1: number, y1: number, x2: number, y2: number, strokeStyle: string, lineWidth: number): void;
    clear();
}