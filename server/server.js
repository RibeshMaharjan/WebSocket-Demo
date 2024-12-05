const { log } = require('console');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected!');

  ws.on('message', message => {
    console.log(`Received from Client: ${message}`);

    ws.send('Heyy CLient');
  })
  
  ws.on('close', () => {
    console.log('Client disconnected!');
  })
})


