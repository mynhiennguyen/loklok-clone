export enum MessageType {
  Drawing = "DRAWING",
  Erasing = "ERASING",
  Undo = "UNDO",
  Redo = "REDO",
  SetBackground = "SET_BACKGROUND",
  ReceiveUserID = "ASSIGN_USERID",
  ActiveUsersList = "LIST_OF_ACTIVE_USERS",
  UserSelectedColor = "USER_SELECTED_COLOR",
  Clear = "CLEAR",
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
