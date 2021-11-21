import { Message, MessageType } from "./message";

/**
 * Interface for any Action (or message) sent between Client and Server via Websocket
 * @param {string} type defines the type of the action, e.g connecting, drawing, erasing, set_background
 * @param {Object} data any data that belongs to the action
 * @param {Date} timestamp
 * @param {string} userId unique identifier for each client / user
 */
export interface Action {
    type: string
    data?: Object
    timestamp?: Date
    userId?: string
    broadcastActionToUsers(): Message
    pushTo(history: Action[]): void
}

export class DrawingAction implements Action {
    type: string = MessageType.Drawing;
    data: Object;
    timestamp: Date;
    userId: string;

    constructor(data: Object, timestamp: Date, userId: string){
        this.data = data;
        this.timestamp = timestamp;
        this.userId = userId;
    }

    broadcastActionToUsers() {
        return new Message(MessageType.Drawing, this.data, this.timestamp, this.userId)
    }
    pushTo(history: Action[]): void {
        history.push(this);
    }
}

export class ErasingAction implements Action {
    type: string = MessageType.Erasing;
    data: Object;
    timestamp: Date;
    userId: string;

    broadcastActionToUsers() {
        return new Message(MessageType.Erasing, this.data, this.timestamp, this.userId)
    }
    pushTo(history: Action[]): void {
        history.push(this);
    }
}

export class UndoAction implements Action {
    data?: Object;
    type: string = MessageType.Undo;
    timestamp: Date;
    userId: string;

    broadcastActionToUsers() {
        throw new Error("Method not implemented.");
        return null;
    }
    pushTo(history: Action[]): void {
        history.push(this);
    }
}

export class RedoAction implements Action {
    data?: Object;
    type: string = MessageType.Redo;
    timestamp: Date;
    userId: string;

    broadcastActionToUsers() {
        throw new Error("Method not implemented.");
        return null;
    }
    pushTo(history: Action[]): void {
        history.push(this);
    }
}

export class SetBackgroundAction implements Action {
    type: string = MessageType.SetBackground;
    data: Object;
    timestamp: Date;
    userId: string;

    broadcastActionToUsers() {
        throw new Error("Method not implemented.");
        return null;
    }
    pushTo(history: Action[]): void {
        history.push(this);
    }
}

export class UserSelectedColorAction implements Action {
    type: string = MessageType.UserSelectedColor;
    data: string;
    timestamp: Date;
    userId: string;

    broadcastActionToUsers() { 
        return new Message(MessageType.UserSelectedColor, this.data, this.timestamp, this.userId)
    }

    pushTo(history: Action[]) {
        // does not need to be in history - do nothing
    }
}