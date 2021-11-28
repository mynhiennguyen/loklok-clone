import {
  Action,
  ClearAction,
  DrawingAction,
  ErasingAction,
  RedoAction,
  SetBackgroundAction,
  UndoAction,
  UserSelectedColorAction,
} from "./action";

/**
 * Interface for any Message sent between Client and Server via Websocket
 * @param {string} type defines the type of the action, e.g connecting, drawing, erasing, set_background
 * @param {Object} data any data that belongs to the action
 * @param {Date} timestamp
 * @param {string} userId unique identifier for each client / user
 */
export class Message {
  type: string;
  data?: Object;
  timestamp?: Date;
  userId?: string;

  constructor(type: string, data?: Object, timestamp?: Date, userId?: string) {
    this.type = type;
    this.data = data;
    this.timestamp = timestamp;
    this.userId = userId;
  }
}

/**
 * Parses Messages (JSON objects) into Actions using the Factory Method Pattern
 */

export class MessageDecoder {
  static parse(message: string): Action {
    const msg: any = JSON.parse(message);
    if (!msg.type) throw new Error("no message type received");
    else if (msg.type === MessageType.Drawing) {
      return new DrawingAction(msg.data, msg.timestamp, msg.userId);
    } else if (msg.type === MessageType.Erasing) {
      return new ErasingAction(msg.data, msg.timestamp, msg.userId);
    } else if (msg.type === MessageType.Undo) {
      return new UndoAction(msg.timestamp, msg.userId);
    } else if (msg.type === MessageType.Redo) {
      return new RedoAction(msg.timestamp, msg.userId);
    } else if (msg.type === MessageType.SetBackground) {
      return new SetBackgroundAction(msg.data, msg.timestamp, msg.userId);
    } else if (msg.type === MessageType.UserSelectedColor) {
      return new UserSelectedColorAction(msg.data, msg.timestamp, msg.userId);
    } else if (msg.type === MessageType.Clear) {
      return new ClearAction(msg.timestamp, msg.userId);
    } else {
      throw new Error("invalid message type received");
    }
  }
}

export enum MessageType {
  Drawing = "DRAWING",
  Erasing = "ERASING",
  Undo = "UNDO",
  Redo = "REDO",
  SetBackground = "SET_BACKGROUND",
  UserSelectedColor = "USER_SELECTED_COLOR",
  AssignUserId = "ASSIGN_USERID",
  ActiveUsersList = "LIST_OF_ACTIVE_USERS",
  Clear = "CLEAR",
}
