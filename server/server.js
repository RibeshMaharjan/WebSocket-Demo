// http server
const http = require('http');

// WebSocket Server
const WebSocket = require('ws');
const WebSocketServer = WebSocket.WebSocketServer; 

const httpServer = http.createServer((request, response) => {
  console.log("We have received a request");
});

httpServer.listen(8080, () => {
  console.log("Server is listening to port 8080");
  
})

function onSocketPreError(e) {
  console.log(e);
}

function onSocketPostError(e) {
  console.log(e); 
}


const webSocketServer = new WebSocketServer({ noServer: true });

httpServer.on('upgrade', (req, socket, head) => {
  socket.on('error', onSocketPreError);

  // perform auth if need

  webSocketServer.handleUpgrade(req, socket, head, ws => {
    socket.removeListener('error', onSocketPreError);
    webSocketServer.emit('connection', ws, req);
  });

  
});


webSocketServer.on('connection', (ws, req) => {
  ws.on('error', onSocketPostError);
  console.log('Client connected');
  
  // receive client message
  ws.on('message', (message, isBinary) => {
    // pass msg to all the users in server
    webSocketServer.clients.forEach(client => {
      if(client.readyState === WebSocket.OPEN) {
        client.send(message, { binary: isBinary });
      }
    })
    
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  })

})