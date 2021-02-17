/**
 * Interface for any Action made on the Canvase, e.g Drawing or Erasing
 */
export interface Action {

    execute(): void;
}