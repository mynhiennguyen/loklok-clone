/**
 * Interface for any Action made on the Canvase, e.g Drawing or Erasing
 */
export interface Action {

    execute(): void;
    recordAndExecute(x1: number, y1: number, x2: number, y2: number): void;
}