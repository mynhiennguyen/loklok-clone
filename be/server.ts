import { Action } from "./src/types/action";
import { HistoryStack } from "./src/types/history";
import { Message, MessageDecoder, MessageType } from "./src/types/message";
import { User } from "./src/types/user";
import { updateUndoRedoAvailabilities } from "./src/utils/utils";
import  WebSocket  from "ws";
import express from 'express';

const PORT = process.env.PORT || 3000;

// create HTTP server
const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);

// create WebSocket server
const wss = new WebSocket.Server({ server });

// history of drawing actions
const history: HistoryStack = new HistoryStack(updateUndoRedoAvailabilities);

// list of active users
export const activeUsers = new Map<WebSocket, User>();

// handle connections
wss.on("connection", (ws: WebSocket) => {;
  handleNewClientConnection(ws);

  // handle incoming messages
  ws.on("message", (msg: string) => {
    const action: Action = MessageDecoder.parse(msg);
    action.pushTo(history);
    broadcastToClients(action.createMessage(ws)); // TODO: remove ws as parameter if possible
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    activeUsers.delete(ws);
    broadcastListOfActiveUsers(activeUsers);
  });
});

const handleNewClientConnection = ((ws: WebSocket) => {
  // create user and assign ID
  const newUser: User = createUser(ws);
  // add new user to list of active users and broadcast list to all other users
  activeUsers.set(ws, newUser);
  broadcastListOfActiveUsers(activeUsers);
  // send current history to client
  // TODO: create message out of this?
  history.undoStack.forEach((m: Action) => {
    ws.send(JSON.stringify(m.createMessage()));
  });
})

const createUser = (ws: WebSocket) => {
  const newUser: User = new User();
  const assignIdMessage = new Message(MessageType.AssignUserId, newUser.userId);
  ws.send(JSON.stringify(assignIdMessage));
  return newUser;
};

const broadcastListOfActiveUsers = (activeUsers: Map<Object, User>) => {
  const msg = new Message(MessageType.ActiveUsersList, [
    ...activeUsers.values(),
  ]);
  wss.clients.forEach((client: WebSocket) => {
    client.send(JSON.stringify(msg));
  });
};

const broadcastToClients = (msg: Message | undefined) => {
  if (msg === undefined) return;
  wss.clients.forEach((client: WebSocket) => {
    client.send(JSON.stringify(msg));

    if (msg.type === MessageType.Undo) {
      history.undoStack.forEach((m: Action) => {
        client.send(JSON.stringify(m.createMessage()));
      });
    }
  });
};
