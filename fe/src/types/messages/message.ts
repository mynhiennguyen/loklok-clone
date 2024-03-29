import { ClearAction } from "../actions/clearAction";
import { DrawingAction } from "../actions/drawingAction";
import { ErasingAction } from "../actions/erasingAction";
import { UserSelectedColorAction } from "../actions/userSelectedColorAction";
import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";
import { UserIdAssignmentAction } from "../actions/userIdAssignmentAction";
import { UndoRedoAvailabilitiesAction } from "../actions/undoRedoAvailabilitiesAction";
import { SetBackgroundAction } from "../actions/setBackgroundAction";
import { store } from "@/store";

export enum MessageType {
  ActiveDrawing = "ACTIVE_DRAWING",
  CompletedDrawing = "COMPLETED_DRAWING",
  ActiveErasing = "ACTIVE_ERASING",
  CompletedErasing = "COMPLETED_ERASING",
  Undo = "UNDO",
  Redo = "REDO",
  SetBackground = "SET_BACKGROUND",
  ReceiveUserID = "ASSIGN_USERID",
  ActiveUsersList = "LIST_OF_ACTIVE_USERS",
  UserSelectedColor = "USER_SELECTED_COLOR",
  Clear = "CLEAR",
  UndoRedoAvailabilities = "UNDO_REDO_AVAILABILITIES",
  ChangeGroup = "CHANGE_GROUP"
}

export class Message {
  private readonly timestamp: Date;

  constructor(
    private readonly type: MessageType,
    private readonly group: string,
    private readonly data?: any,
    private readonly userId?: string,
  ) {
    this.timestamp = new Date();
  }
}

export class MessageDecoder {
  static parse(
    message: string,
    canvas: CanvasUI,
    backgroundCanvas: CanvasUI,
    ws: WebSocket
  ): Action | undefined {
    const msg: any = JSON.parse(message);
    console.log(msg);
    if (!msg.type) throw new Error("no message type received");
    else if(msg.group !== store.state.group) return undefined; //ignore message
    else if (msg.type === MessageType.ReceiveUserID) {
      return new UserIdAssignmentAction(msg.data, canvas, ws);
    } else if (
      msg.type === MessageType.ActiveDrawing ||
      msg.type === MessageType.CompletedDrawing
    ) {
      return new DrawingAction(msg.data, canvas, ws);
    } else if (
      msg.type === MessageType.ActiveErasing ||
      msg.type === MessageType.CompletedErasing
    ) {
      return new ErasingAction(msg.data, canvas, ws);
    } else if (msg.type === MessageType.SetBackground) {
      return new SetBackgroundAction(msg.data, backgroundCanvas, ws);
    } else if (
      msg.type === MessageType.UserSelectedColor ||
      msg.type === MessageType.ActiveUsersList
    ) {
      return new UserSelectedColorAction(msg.data, canvas, ws);
    } else if (
      msg.type === MessageType.Clear ||
      msg.type === MessageType.Undo
    ) {
      return new ClearAction(canvas, ws);
    } else if (msg.type === MessageType.UndoRedoAvailabilities) {
      return new UndoRedoAvailabilitiesAction(msg.data, canvas, ws);
    } else {
      throw new Error(`invalid message type received: ${msg.type}`);
    }
  }
}
