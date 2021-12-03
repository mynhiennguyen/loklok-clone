import { ClearAction } from "../actions/clearAction";
import { DrawingAction } from "../actions/drawingAction";
import { ErasingAction } from "../actions/erasingAction";
import { UserSelectedColorAction } from "../actions/userSelectedColorAction";
import { Action } from "../interfaces/action";
import { CanvasUI } from "../interfaces/canvas";
import { store } from "../../store";
import { UserIdAssignmentAction } from "../actions/userIdAssignmentAction";

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
  //TODO: MessageSequence
}

export class Message {
  private readonly timestamp: Date;

  constructor(
    private readonly type: MessageType,
    private readonly data?: any,
    private readonly userId?: string
  ) {
    this.timestamp = new Date();
  }
}

export class MessageDecoder {
  static parse(message: string, canvas: CanvasUI, ws: WebSocket): Action {
    console.log(message);
    const msg: any = JSON.parse(message);
    if (!msg.type) throw new Error("no message type received");
    else if (msg.type === MessageType.ReceiveUserID) {
      return new UserIdAssignmentAction(msg.data, canvas, ws);
    } else if (msg.type === MessageType.ActiveDrawing) {
      return new DrawingAction(msg.data, canvas, ws);
    } else if (msg.type === MessageType.ActiveErasing) {
      return new ErasingAction(msg.data, canvas, ws);
    }
    // else if (msg.type === MessageType.SetBackground) {
    //   return new SetBackgroundAction(msg.data, canvas, ws);
    // }
    else if (
      msg.type === MessageType.UserSelectedColor ||
      msg.type === MessageType.ActiveUsersList
    ) {
      return new UserSelectedColorAction(msg.data, canvas, ws);
    } else if (msg.type === MessageType.Clear) {
      return new ClearAction(canvas, ws);
    } else {
      throw new Error(`invalid message type received: ${msg.type}`);
    }
  }
}
