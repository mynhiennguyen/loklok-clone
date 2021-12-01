import { Action } from "./action";

export class HistoryStack {
  undoStack: Action[] = [];
  redoStack: Action[] = [];

  push(action: Action): void {
    if (action == null) return;
    this.undoStack.push(action);
    this.redoStack = this.redoStack.filter(e => e.userId !== action.userId); // once new Action is added, clear redoStack from this users actions
    //TODO: limit HistoryStack size
  }

  undo(userId: string | undefined): void {
    if(!userId) return;
    // check if the user has any actions in the history
    if (this.undoStack.filter(e => e.userId === userId).length === 0) return;
    // retrieve the users latest action, remove it from history and push it to redoStack
    const lastActionIndex: number = this.undoStack.map(e => e.userId).lastIndexOf(userId);
    const lastAction: Action[] = this.undoStack.splice(lastActionIndex, 1)
    this.redoStack.push(lastAction[0]);
  }

  redo(userId: string | undefined): void {
    if(!userId) return;
    // check if the user has any actions in redoStack
    if (this.redoStack.filter(e => e.userId === userId).length === 0) return;
    // retrieve the users latest undone action, remove it from redoStack and push it to undoStack
    const lastActionIndex: number = this.redoStack.map(e => e.userId).lastIndexOf(userId);
    const lastAction: Action[] = this.redoStack.splice(lastActionIndex, 1)
    this.undoStack.push(lastAction[0]);
  }
}
