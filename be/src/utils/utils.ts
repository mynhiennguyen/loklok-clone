import { activeUsers } from "../../server";
import { Message, MessageType } from "../types/message";

const crypto = require("crypto");

export const uuid = () => {
  return crypto.randomBytes(16).toString("hex");
};

// Probably doesn't belong here - TODO: move function
export const updateUndoRedoAvailabilities = (userId: string, isUndoAvailable: boolean, isRedoAvailable: boolean) => {
  const msg: Message = new Message(MessageType.UndoRedoAvailabilties, {"isUndoAvailable": isUndoAvailable, "isRedoAvailable": isRedoAvailable}, undefined, userId);
  const wsConnection: any | undefined = [...activeUsers.entries()].find(([, user]) => user.userId === userId)?.[0];

  wsConnection?.send(JSON.stringify(msg));
}
