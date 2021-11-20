export enum MessageType {
    Drawing = "DRAWING",
    Erasing = "ERASING",
    Undo = "UNDO",
    Redo = "REDO",
    SetBackground = "SET_BACKGROUND",
    ReceiveUserID = "ASSIGN_USERID",
    ActiveUsersList ="LIST_OF_ACTIVE_USERS"
}

export class Message {
    type: MessageType
    data: any
    timestamp: Date
    userId: string

    constructor(type: MessageType, data: any, userId: string) {
        this.type = type
        this.data = data
        this.timestamp = new Date()
        this.userId = userId
    }
}