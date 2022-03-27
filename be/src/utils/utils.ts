import { activeUsers } from "../../server";
import { Message, MessageType } from "../types/message";
import crypto from "crypto";
import WebSocket from "ws";

export const uuid = () => {
  return crypto.randomUUID();
};

// Probably doesn't belong here - TODO: move function
export const updateUndoRedoAvailabilities = (
  userId: string,
  group: string,
  isUndoAvailable: boolean,
  isRedoAvailable: boolean
) => {
  const msg: Message = new Message(
    MessageType.UndoRedoAvailabilties,
    group,
    { isUndoAvailable: isUndoAvailable, isRedoAvailable: isRedoAvailable },
    undefined,
    userId
  );
  const wsConnection: WebSocket | undefined = [...activeUsers.entries()].find(
    ([, user]) => user.userId === userId
  )?.[0];

  wsConnection?.send(JSON.stringify(msg));
};
