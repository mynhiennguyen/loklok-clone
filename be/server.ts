import { Action } from "./src/types/action";
import { uuidv4 } from "./src/utils/utils";

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

// handle connections
wss.on('connection', (ws) => {

  console.log('Client connected');
  // TODO: create and assign UUID for newly connected client

  history.forEach((m) => { // send current history to client
    ws.send(m);
  })

  // handle incoming messages 
  ws.on('message', (msg: any) => {
    const action: Action = Object.assign(new Action(), JSON.parse(msg)) // Parse message into an Action object
    history.push(action); // add action to history
    wss.clients.forEach((client) => { // broadcast action to all other clients
      client.send(msg)
    })
  })

  //TODO: ping clients

  ws.on('close', () => console.log('Client disconnected'));
});