import { activeUsers } from "../../server";
import { HistoryStack } from "./history";
import { Message, MessageType } from "./message";
import { Color, User } from "./user";
import WebSocket from "ws";

/**
 * Abstract class for any Action (or message) sent between Client and Server via Websocket
 * @param {string} type defines the type of the action, e.g connecting, drawing, erasing, set_background
 * @param {string} group id of group where this action takes place
 * @param {Record<string, unknown>} data any data that belongs to the action
 * @param {Date} timestamp
 * @param {string} userId unique identifier for each client / user
 */
export abstract class Action<
  TData = Record<string, unknown> | unknown | undefined
> {
  constructor(
    public readonly type: MessageType,
    public readonly group: string,
    public readonly data?: TData,
    public readonly timestamp?: Date,
    public readonly userId?: string
  ) {}

  createMessage(ws?: WebSocket): Message | undefined {
    return new Message(this.type, this.group, this.data, this.timestamp, this.userId);
  }

  pushTo(history: HistoryStack): void {
    history.push(this);
  }
}

export class ActiveDrawingAction extends Action<Record<string, any>> {
  constructor(group: string, data: Record<string, any>, timestamp: Date, userId: string) {
    super(MessageType.ActiveDrawing, group, data, timestamp, userId);
  }
  override pushTo(history: HistoryStack): void {
    // does not need to be in history - do nothing
  }
}

export class CompletedDrawingAction extends Action<Record<string, any>> {
  constructor(group: string, data: Record<string, any>, timestamp: Date, userId: string) {
    super(MessageType.CompletedDrawing, group, data, timestamp, userId);
  }
  override createMessage(ws?: WebSocket): Message | undefined {
    if (ws) {
      // when action is redirected to all other users
      return undefined;
    } else {
      // when action is part of history-broadcast on new connection 😅. TODO: refactor.
      return super.createMessage();
    }
  }
}

export class ActiveErasingAction extends Action<Record<string, any>> {
  constructor(group: string, data: Record<string, any>, timestamp: Date, userId: string) {
    super(MessageType.ActiveErasing, group, data, timestamp, userId);
  }
  override pushTo(history: HistoryStack): void {
    // does not need to be in history - do nothing
  }
}

export class CompletedErasingAction extends Action<Record<string, any>> {
  constructor(group: string, data: Record<string, any>, timestamp: Date, userId: string) {
    super(MessageType.CompletedErasing, group, data, timestamp, userId);
  }
  override createMessage(ws?: WebSocket): Message | undefined {
    if (ws) {
      // when action is redirected to all other users
      return undefined;
    } else {
      // when action is part of history-broadcast on new connection 😅. TODO: refactor.
      return super.createMessage();
    }
  }
}

export class UndoAction extends Action {
  constructor(group: string, timestamp: Date, userId: string) {
    super(MessageType.Undo, group, undefined, timestamp, userId);
  }

  override pushTo(history: HistoryStack): void {
    // manipulates history instead
    history.undo(this.userId);
  }
}

export class RedoAction extends Action {
  lastAction: Action | undefined;

  constructor(group: string, timestamp: Date, userId: string) {
    super(MessageType.Redo, group, undefined, timestamp, userId);
  }

  override pushTo(history: HistoryStack): void {
    // manipulates history instead
    this.lastAction = history.redo(this.userId);
  }

  override createMessage(): Message | undefined {
    if (!this.lastAction) return undefined;
    return this.lastAction!.createMessage();
  }
}

export class SetBackgroundAction extends Action<Record<string, any>> {
  constructor(group: string, data: Record<string, any>, timestamp: Date, userId: string) {
    super(MessageType.SetBackground, group, data, timestamp, userId);
  }
}

export class ClearAction extends Action {
  constructor(group: string, timestamp: Date, userId: string) {
    super(MessageType.Clear, group, undefined, timestamp, userId);
  }
}

export class UserSelectedColorAction extends Action<Color> {
  constructor(group: string, data: Color, timestamp: Date, userId: string) {
    super(MessageType.UserSelectedColor, group, data, timestamp, userId);
  }

  override createMessage(ws: WebSocket): Message {
    if (!activeUsers.get(ws)) throw Error("User not found");
    const user: User = activeUsers.get(ws)!;
    user.setColor(this.data || Color.BLACK);
    activeUsers.set(ws, user);
    return new Message(MessageType.ActiveUsersList, this.group, [...activeUsers.values()]);
  }

  override pushTo(history: HistoryStack) {
    // does not need to be in history - do nothing
  }
}

export class SendHistoryAction extends Action {
  constructor(group: string, timestamp: Date, userId: string) {
    super(MessageType.ChangeGroup, group, undefined, timestamp, userId);
  }
}
