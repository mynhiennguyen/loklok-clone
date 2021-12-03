import { Action } from "./src/types/action";
import { HistoryStack } from "./src/types/history";
import { Message, MessageDecoder, MessageType } from "./src/types/message";
import { User } from "./src/types/user";
import { uuid } from "./src/utils/utils";

const express = require("express");
const { Server } = require("ws");

const PORT = process.env.PORT || 3000;

// create HTTP server
const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);

// create WebSocket server
const wss = new Server({ server });

// history of drawing actions
const history: HistoryStack = new HistoryStack();

// list of active users
export const activeUsers = new Map<Object, User>();

// handle connections
wss.on("connection", (ws: any) => {
  console.log("New client connected");
  // TODO: refactor to handleNewClientConnection()
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

  // handle incoming messages
  ws.on("message", (msg: any) => {
    const action: Action = MessageDecoder.parse(msg);
    action.pushTo(history);
    broadcastToClients(action.createMessage(ws)) // TODO: remove ws as parameter if possible
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    activeUsers.delete(ws);
    broadcastListOfActiveUsers(activeUsers);
  });
});

const broadcastListOfActiveUsers = (activeUsers: Map<Object, User>) => {
  const msg = new Message(MessageType.ActiveUsersList, [
    ...activeUsers.values(),
  ]);
  wss.clients.forEach((client: any) => {
    client.send(JSON.stringify(msg));
  });
};

const createUser = (ws: any) => {
  const newUser: User = new User();
  const assignIdMessage = new Message(MessageType.AssignUserId, newUser.userId);
  ws.send(JSON.stringify(assignIdMessage));
  return newUser;
};

const broadcastToClients = (msg: Message | undefined) => {
  if(msg === undefined) return;
  wss.clients.forEach((client: any) => {
    client.send(JSON.stringify(msg));
  });
}
