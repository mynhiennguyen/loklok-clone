const express = require('express');
const { Server } = require('ws');

const PORT = 3000;

// create HTTP server
const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// create WebSocket server
const wss = new Server({ server });

// handle connections
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (msg) => {
      wss.clients.forEach((client) => {
        client.send(msg)
    })
    })
    ws.on('close', () => console.log('Client disconnected'));
  });