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
  // ["Group A", new Group("Group A")],
  // ["Group B", new Group("Group B")],
  // ["Group C", new Group("Group C")],
]);
const DEFAULT_GROUP_KEY = "Group A";

/* POSTGRES DATABASE */

const db: Database = new PostgresDatabase();
db.connect();

/* HTTP SERVER */

const router = express();
const cors = require("cors");
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());

router.get("/groups", (request, response) => {
  const userId = request.query.user as string;
  if (userId) {
    db.getGroupsByUser(userId)?.then((groups) => {
      response.send(groups);
    });
  }
});

router.post("/groups", (request, response) => {
  const groupData = request.body;
  if (groupData) {
    db.addGroup(groupData.groupname)?.then((groupId: string | void) => {
      db.addGroupMembership(groupData.users, groupId as string);
    });
    // TODO: add response
  }
});
router.get("/users", (request, response) => {
  db.getAllUsers()?.then((users) => response.send(users));
});
const server = express()
  .use(router)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// create WebSocket server
const wss = new WebSocket.Server({ server });

// list of active users
export const activeUsers = new Map<WebSocket, User>();

/* WEBSOCKET SERVER */

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
      if (action.data) db.addUser(action.data.id, action.data.name); // save new user to DB
      //TODO: return and set new ID in activeUsersList
      // TODO: broadcastList
    } else if (group) {
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
  const newUser: User = createUser(ws);
  activeUsers.set(ws, newUser);

  // broadcastListOfActiveUsers(activeUsers);
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
