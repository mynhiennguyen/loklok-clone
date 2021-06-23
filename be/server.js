const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;

// create HTTP server
const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// create WebSocket server
const wss = new Server({ server });

const currentDrawing = [];

// handle connections
wss.on('connection', (ws) => {

    console.log('Client connected');
    currentDrawing.forEach((m) => {
      ws.send(m);
    })

    ws.on('message', (msg) => {
      currentDrawing.push(msg);
        wss.clients.forEach((client) => {
          client.send(msg)
      })
  })

    ws.on('close', () => console.log('Client disconnected'));
  });