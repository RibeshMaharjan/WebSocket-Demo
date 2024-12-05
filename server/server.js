// http server
const { log } = require('console');
const http = require('http'); 

// WebSocket Server
const WebSocketServer = require('websocket').server; 
let connection = null;


const httpServer = http.createServer((request, response) => {
  console.log("We have received a request");
});

const webSocket = new WebSocketServer({
  "httpServer": httpServer
});

webSocket.on('request', request => {
  
  connection = request.accept(null, request.origin);
  
  console.log('Client connected!');
  
  connection.on('open', () => console.log('Opened!!'));

  connection.on('close', () => {
    console.log('Client disconnected!!')
  });

  connection.on('message', (message) => {
    console.log(`Received message: ${message.utf8Data}`);
    connection.send('Hey Client');
  });
}) 


httpServer.listen(8080, () => {
  console.log("Server is listening to port 8080");
  
})


