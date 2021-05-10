const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

// create HTTP server
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// create WebSocket server
const { Server } = require('ws');

const wss = new Server({ server });

// handle connections
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
  });

  setInterval(() => {
    wss.clients.forEach((client) => {
      client.send(new Date().toTimeString()); // send current time every second
    });
  }, 1000);