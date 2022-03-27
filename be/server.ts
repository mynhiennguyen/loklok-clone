import {
  Action,
  SendHistoryAction,
  AssignUserIdAction,
} from "./src/types/action";
import { Message, MessageDecoder, MessageType } from "./src/types/message";
import { User } from "./src/types/user";
import WebSocket from "ws";
import express from "express";
import { Group } from "./src/types/group";
import { Database } from "./src/db/database";
import { PostgresDatabase } from "./src/db/postgresDatabase";
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 3000;

// init 3 groups
// TODO: dynamic groups
const groups = new Map<string, Group>([
  ["Group A", new Group("Group A")],
  ["Group B", new Group("Group B")],
  ["Group C", new Group("Group C")],
]);
const DEFAULT_GROUP_KEY = "Group A";

// create HTTP server
const router = express.Router();
const cors = require("cors");
router.get("/", cors(), (request, response) => {
  response.send(Array.from(groups.keys()));
});
const server = express()
  .use(router)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// create WebSocket server
const wss = new WebSocket.Server({ server });

// list of active users
export const activeUsers = new Map<WebSocket, User>();

// Database
const db: Database = new PostgresDatabase();
db.connect();

// handle connections
wss.on("connection", (ws: WebSocket) => {
  handleNewClientConnection(ws);

  // handle incoming messages
  ws.on("message", (msg: string) => {
    const action: Action = MessageDecoder.parse(msg);
    console.log("Action received: ", action);
    const group: Group | undefined = groups.get(action.groupId);

    // TODO: refactor
    if (action instanceof SendHistoryAction) {
      group?.historyStack.undoStack.forEach((a: Action) => {
        ws.send(JSON.stringify(a.createMessage()));
      });
    } else if (action instanceof AssignUserIdAction) {
      ws.send(JSON.stringify(action.createMessage()));
      if (action.data) db.addUser(action.data.id, action.data.name);
    } else if (group) {
      // Broadcasted message
      //extract group and pushTo specific history of this group
      action.pushTo(group.historyStack);
      //broadcast to clients of this group
      broadcastToClients(action.createMessage(ws), group); // TODO: remove ws as parameter if possible
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    activeUsers.delete(ws);
    broadcastListOfActiveUsers(activeUsers);
  });
});

const handleNewClientConnection = (ws: WebSocket) => {
  // create user and assign ID
  const newUser: User = createUser(ws);
  // add new user to list of active users and broadcast list to all other users
  activeUsers.set(ws, newUser);
  broadcastListOfActiveUsers(activeUsers);
  // send history of default group (Group A) to client
  groups.get(DEFAULT_GROUP_KEY)?.historyStack.undoStack.forEach((m: Action) => {
    ws.send(JSON.stringify(m.createMessage()));
  });
};

const createUser = (ws: WebSocket) => {
  const newUser: User = new User();
  return newUser;
};

const broadcastListOfActiveUsers = (activeUsers: Map<Object, User>) => {
  const msg = new Message(MessageType.ActiveUsersList, DEFAULT_GROUP_KEY, [
    ...activeUsers.values(),
  ]);
  wss.clients.forEach((client: WebSocket) => {
    client.send(JSON.stringify(msg));
  });
};

const broadcastToClients = (
  msg: Message | undefined,
  group: Group | undefined
) => {
  if (msg === undefined) return;
  wss.clients.forEach((client: WebSocket) => {
    client.send(JSON.stringify(msg));

    if (msg.type === MessageType.Undo) {
      group?.historyStack.undoStack.forEach((m: Action) => {
        client.send(JSON.stringify(m.createMessage()));
      });
    }
  });
};
