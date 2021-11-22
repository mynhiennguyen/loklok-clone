import { activeUsers } from "../../server";
import { Message, MessageType } from "./message";
import { Color, User } from "./user";

/**
 * Abstrac class for any Action (or message) sent between Client and Server via Websocket
 * @param {string} type defines the type of the action, e.g connecting, drawing, erasing, set_background
 * @param {Object} data any data that belongs to the action
 * @param {Date} timestamp
 * @param {string} userId unique identifier for each client / user
 */
export abstract class Action {
    type: string
    data?: Object
    timestamp?: Date
    userId?: string;

    constructor(type: MessageType, data?: Object, timestamp?:Date, userId?:string) {
        this.type = type;
        this.data = data;
        this.timestamp = timestamp;
        this.userId = userId;
    }

    createMessage(ws?: Object): Message {
        return new Message(this.type, this.data, this.timestamp, this.userId)
    }

    pushTo(history: Action[]): void {
        history.push(this);
    }
}

export class DrawingAction extends Action {
    constructor(data: Object, timestamp: Date, userId: string){
        super(MessageType.Drawing, data, timestamp, userId)
    }
}

export class ErasingAction extends Action {
    constructor(data: Object, timestamp: Date, userId: string){
        super(MessageType.Erasing, data, timestamp, userId)
    }
}

export class UndoAction extends Action {
    constructor(data: Object, timestamp: Date, userId: string){
        super(MessageType.Undo, data, timestamp, userId)
    }
}

export class RedoAction extends Action {
    constructor(data: Object, timestamp: Date, userId: string){
        super(MessageType.Redo, data, timestamp, userId)
    }
}

export class SetBackgroundAction extends Action {
    constructor(data: Object, timestamp: Date, userId: string){
        super(MessageType.SetBackground, data, timestamp, userId)
    }
}

export class UserSelectedColorAction implements Action {
    type: string = MessageType.UserSelectedColor;
    data: Color;
    timestamp: Date;
    userId: string;

    constructor(data: Color, timestamp: Date, userId: string){
        this.data = data;
        this.timestamp = timestamp;
        this.userId = userId;
    }

    createMessage(ws: any) {
        if(!activeUsers.get(ws)) throw Error("User not found")
        const user: User = activeUsers.get(ws)!;
        user.setColor(this.data);
        activeUsers.set(ws, user);
        return new Message(MessageType.ActiveUsersList, [...activeUsers.values()])
    }

    pushTo(history: Action[]) {
        // does not need to be in history - do nothing
    }
}