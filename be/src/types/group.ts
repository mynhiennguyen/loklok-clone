import { HistoryStack } from "./history";
import { updateUndoRedoAvailabilities } from "../utils/utils";

/**
 * A group owns its own canvas + historyStack.
 */
export class Group {
    historyStack: HistoryStack;

    constructor(public readonly id: String) {
        this.historyStack = new HistoryStack(updateUndoRedoAvailabilities)
    }
}