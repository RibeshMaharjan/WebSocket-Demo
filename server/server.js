// http server
const { log } = require('console');
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


webSocketServer.getUniqueID = function() {
  function s4() {
    return Math.floor((1 + Math.random())  * 0x10000).toString(16).substring(1);
  }

  return s4() + s4() + '-' + s4();
};

webSocketServer.on('connection', (ws, req) => {
  ws.on('error', onSocketPostError);
  console.log('Client connected');
  ws.id = webSocketServer.getUniqueID();

  ws.send(ws.id);
  
  // receive client message
  ws.on('message', (msg, isBinary) => {

    const message = JSON.parse(msg);

    // pass msg to all the users in server
    webSocketServer.clients.forEach(client => {
      if(client === ws || client.readyState !== WebSocket.OPEN) return;

      if(message.type === 'public') {
        client.send(message.content, { binary: isBinary });
      }
      
      if(message.type === 'private' && client.id === message.recipientId) {
        client.send(message.content, { binary: isBinary });
        return;
      } 
    })
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  })

})