/**
 * Interface for any Message sent between Client and Server via Websocket
 * @param {string} type defines the type of the action, e.g connecting, drawing, erasing, set_background
 * @param {Object} data any data that belongs to the action
 * @param {Date} timestamp
 * @param {string} userId unique identifier for each client / user
 */
export class Message {
    type: string
    data?: Object
    timestamp?: Date
    userId?: string

    constructor(type: string, data?: Object, timestamp?: Date, userId?:string) {
        this.type = type
        this.data = data
        this.timestamp = timestamp
        this.userId = userId
    }
}

export enum MessageType {
    Drawing = "DRAWING",
    Erasing = "ERASING",
    Undo = "UNDO",
    Redo = "REDO",
    SetBackground = "SET_BACKGROUND",
    AssignUserId = "ASSIGN_USERID",
    ActiveUsersList ="LIST_OF_ACTIVE_USERS"
}