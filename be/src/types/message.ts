import {
  Action,
  ActiveDrawingAction,
  ActiveErasingAction,
  ClearAction,
  CompletedDrawingAction,
  CompletedErasingAction,
  RedoAction,
  SendHistoryAction,
  SetBackgroundAction,
  UndoAction,
  UserSelectedColorAction,
  AssignUserIdAction,
} from "./action";

/**
 * Interface for any Message sent between Client and Server via Websocket
 * @param {string} type defines the type of the action, e.g connecting, drawing, erasing, set_background
 * @param {Object} data any data that belongs to the action
 * @param {Date} timestamp
 * @param {string} userId unique identifier for each client / user
 */
export class Message {
  constructor(
    public readonly type: MessageType,
    public readonly groupId: string,
    private readonly data?: any,
    private readonly timestamp?: Date,
    private readonly userId?: string
  ) {}
}

/**
 * Parses Messages (JSON objects) into Actions using the Factory Method Pattern
 */

export class MessageDecoder {
  static parse(message: string): Action {
    const msg: Record<string, any> = JSON.parse(message);
    console.log(msg);
    if (!msg.type) throw new Error("no message type received");
    else if (msg.type === MessageType.ActiveDrawing) {
      return new ActiveDrawingAction(
        msg.groupId,
        msg.data,
        msg.timestamp,
        msg.userId
      );
    } else if (msg.type === MessageType.ActiveErasing) {
      return new ActiveErasingAction(
        msg.groupId,
        msg.data,
        msg.timestamp,
        msg.userId
      );
    } else if (msg.type === MessageType.CompletedDrawing) {
      return new CompletedDrawingAction(
        msg.groupId,
        msg.data,
        msg.timestamp,
        msg.userId
      );
    } else if (msg.type === MessageType.CompletedErasing) {
      return new CompletedErasingAction(
        msg.groupId,
        msg.data,
        msg.timestamp,
        msg.userId
      );
    } else if (msg.type === MessageType.Undo) {
      return new UndoAction(msg.groupId, msg.timestamp, msg.userId);
    } else if (msg.type === MessageType.Redo) {
      return new RedoAction(msg.groupId, msg.timestamp, msg.userId);
    } else if (msg.type === MessageType.SetBackground) {
      return new SetBackgroundAction(
        msg.groupId,
        msg.data,
        msg.timestamp,
        msg.userId
      );
    } else if (msg.type === MessageType.UserSelectedColor) {
      return new UserSelectedColorAction(
        msg.groupId,
        msg.data,
        msg.timestamp,
        msg.userId
      );
    } else if (msg.type === MessageType.Clear) {
      return new ClearAction(msg.groupId, msg.timestamp, msg.userId);
    } else if (msg.type === MessageType.ChangeGroup) {
      return new SendHistoryAction(msg.groupId, msg.timestamp, msg.userId);
    } else if (msg.type === MessageType.RequestUserId) {
      return new AssignUserIdAction(msg.groupId, msg.timestamp, msg.userId);
    } else {
      throw new Error(`invalid message type received: ${msg.type}`);
    }
  }
}

export enum MessageType {
  ActiveDrawing = "ACTIVE_DRAWING",
  CompletedDrawing = "COMPLETED_DRAWING",
  ActiveErasing = "ACTIVE_ERASING",
  CompletedErasing = "COMPLETED_ERASING",
  Undo = "UNDO",
  Redo = "REDO",
  SetBackground = "SET_BACKGROUND",
  UserSelectedColor = "USER_SELECTED_COLOR",
  RequestUserId = "REQUEST_USERID",
  AssignUserId = "ASSIGN_USERID",
  ActiveUsersList = "LIST_OF_ACTIVE_USERS",
  Clear = "CLEAR",
  UndoRedoAvailabilties = "UNDO_REDO_AVAILABILITIES",
  ChangeGroup = "CHANGE_GROUP",
}
