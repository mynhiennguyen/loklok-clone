import { Action } from "./src/types/action";
import { Message, MessageDecoder, MessageType } from "./src/types/message";
import { User } from "./src/types/user";
import { uuid } from "./src/utils/utils";

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;

// create HTTP server
const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// create WebSocket server
const wss = new Server({ server });

// history of drawing actions
const history: Action[] = [];

// list of active users
export const activeUsers = new Map<Object,User>();

// handle connections
wss.on('connection', (ws) => {

  console.log('New client connected');
  // create user and assign ID
  const newUser: User = new User();
  const assignIdMessage = new Message(MessageType.AssignUserId, newUser.userId);
  ws.send(JSON.stringify(assignIdMessage))

  // add user to list of active users and broadcast list to all other users
  activeUsers.set(ws, newUser);
  broadcastListOfActiveUsers(activeUsers);

  // send current history to client
  history.forEach((m) => { 
    ws.send(JSON.stringify(m));
  })

  // handle incoming messages 
  ws.on('message', (msg: any) => {
    const action: Action = MessageDecoder.parse(msg);
    action.pushTo(history);
    wss.clients.forEach((client) => { // broadcast action to all other clients
      const msg: Message = action.createMessage(ws);
      client.send(JSON.stringify(msg))
    })
  })

  ws.on('close', () => {
    console.log('Client disconnected');
    activeUsers.delete(ws);
    broadcastListOfActiveUsers(activeUsers);
  });
});

const broadcastListOfActiveUsers = (activeUsers) => {
  const msg = new Message(MessageType.ActiveUsersList, [...activeUsers.values()])
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(msg));
  })
}