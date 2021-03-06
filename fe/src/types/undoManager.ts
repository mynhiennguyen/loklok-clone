import { Action } from "./interfaces/action";
import { CanvasUI } from "./interfaces/canvas";

export class UndoManager {
    undoStack: Action[] = []
    redoStack: Action[] = []
    canvas: CanvasUI

    constructor(canvas: CanvasUI) {
        this.canvas = canvas;
    }

    push(action: Action): void {
        if(action == null) return;

        this.undoStack.push(action);
        this.redoStack = []; //once new Action is added, clear redoStack
    }

    undo(): void {
        if (this.undoStack.length == 0) return
        const lastAction: Action = this.undoStack.pop()
        this.redoStack.push(lastAction)
        //clear canvas and redraw it
        this.canvas.clear();
        this.undoStack.forEach((action: Action) => {
            action.execute();
        });
    }

    redo(): void {
        if(this.redoStack.length == 0) return
        const lastAction: Action = this.redoStack.pop();
        this.undoStack.push(lastAction);
        lastAction.execute();
    }
}