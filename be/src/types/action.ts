import { activeUsers } from "../../server";
import { HistoryStack } from "./history";
import { Message, MessageType } from "./message";
import { Color, User } from "./user";

/**
 * Abstract class for any Action (or message) sent between Client and Server via Websocket
 * @param {string} type defines the type of the action, e.g connecting, drawing, erasing, set_background
 * @param {Record<string, unknown>} data any data that belongs to the action
 * @param {Date} timestamp
 * @param {string} userId unique identifier for each client / user
 */
export abstract class Action<
  TData = Record<string, unknown> | unknown | undefined
> {
  constructor(
    public readonly type: MessageType,
    public readonly data?: TData,
    public readonly timestamp?: Date,
    public readonly userId?: string
  ) {}

  createMessage(ws?: Object): Message | undefined {
    return new Message(this.type, this.data, this.timestamp, this.userId);
  }

  pushTo(history: HistoryStack): void {
    history.push(this);
  }
}

export class ActiveDrawingAction extends Action<Record<string, any>> {
  constructor(data: Record<string, any>, timestamp: Date, userId: string) {
    super(MessageType.ActiveDrawing, data, timestamp, userId);
  }
  override pushTo(history: HistoryStack): void {
    // does not need to be in history - do nothing
  }
}

export class CompletedDrawingAction extends Action<Record<string, any>> {
  constructor(data: Record<string, any>, timestamp: Date, userId: string) {
    super(MessageType.CompletedDrawing, data, timestamp, userId);
  }
  override createMessage(ws?: Object): Message | undefined {
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
  constructor(data: Record<string, any>, timestamp: Date, userId: string) {
    super(MessageType.ActiveErasing, data, timestamp, userId);
  }
  override pushTo(history: HistoryStack): void {
    // does not need to be in history - do nothing
  }
}

export class CompletedErasingAction extends Action<Record<string, any>> {
  constructor(data: Record<string, any>, timestamp: Date, userId: string) {
    super(MessageType.CompletedErasing, data, timestamp, userId);
  }
  override createMessage(ws?: Object): Message | undefined {
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
  constructor(timestamp: Date, userId: string) {
    super(MessageType.Undo, undefined, timestamp, userId);
  }

  override pushTo(history: HistoryStack): void {
    // manipulates history instead
    history.undo(this.userId);
  }
}

export class RedoAction extends Action {
  lastAction: Action | undefined;

  constructor(timestamp: Date, userId: string) {
    super(MessageType.Redo, undefined, timestamp, userId);
  }

  override pushTo(history: HistoryStack): void {
    // manipulates history instead
    this.lastAction = history.redo(this.userId);
  }

  override createMessage(): Message | undefined {
    if(!this.lastAction) return undefined;
    return this.lastAction!.createMessage();
  }
}

export class SetBackgroundAction extends Action<Record<string, any>> {
  constructor(data: Record<string, any>, timestamp: Date, userId: string) {
    super(MessageType.SetBackground, data, timestamp, userId);
  }
}

export class ClearAction extends Action {
  constructor(timestamp: Date, userId: string) {
    super(MessageType.Clear, undefined, timestamp, userId);
  }
}

export class UserSelectedColorAction extends Action<Color> {
  constructor(data: Color, timestamp: Date, userId: string) {
    super(MessageType.UserSelectedColor, data, timestamp, userId);
  }

  override createMessage(ws: any): Message {
    if (!activeUsers.get(ws)) throw Error("User not found");
    const user: User = activeUsers.get(ws)!;
    user.setColor(this.data || Color.BLACK);
    activeUsers.set(ws, user);
    return new Message(MessageType.ActiveUsersList, [...activeUsers.values()]);
  }

  override pushTo(history: HistoryStack) {
    // does not need to be in history - do nothing
  }
}
