import { Message, MessageType } from "./src/types/message";
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
const history = [];

// list of active users
const activeUsers = new Map<Object,string>();

// handle connections
wss.on('connection', (ws) => {

  console.log('Client connected');
  const userId: string = createAndAssignUserId(ws)
  activeUsers.set(ws, userId);
  broadcastListOfActiveUsers(activeUsers);

  history.forEach((m) => { // send current history to client
    ws.send(JSON.stringify(m));
  })

  // handle incoming messages 
  ws.on('message', (msg: any) => {
    const message: Message = JSON.parse(msg) // Parse message into an Action object
    history.push(message); // add action to history
    console.log(msg)
    wss.clients.forEach((client) => { // broadcast action to all other clients
      client.send(msg)
    })
  })

  //TODO: ping clients

  ws.on('close', () => {
    console.log('Client disconnected');
    activeUsers.delete(ws);
    broadcastListOfActiveUsers(activeUsers);
  });
});

//create and assign UUID for newly connected user
const createAndAssignUserId = (ws) => {
  const userId: string = uuid();
  const msg = new Message(MessageType.AssignUserId, userId)
  ws.send(JSON.stringify(msg))

  return userId;
}

const broadcastListOfActiveUsers = (activeUsers) => {
  console.log("broadcasting list of active users")
  const msg = new Message(MessageType.ActiveUsersList, [...activeUsers.values()])
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(msg));
  })
}