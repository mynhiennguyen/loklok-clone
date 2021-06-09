/** 
 * Interface for any Canvas that can be used. Defines methods that can be used on it.
*/
export interface CanvasUI {
    drawLine(x1: number, y1: number, x2: number, y2: number, strokeStyle: string, lineWidth: number): void;
    eraseLine(x1: number, y1: number, x2: number, y2: number, lineWidth: number): void;
    clear();
}