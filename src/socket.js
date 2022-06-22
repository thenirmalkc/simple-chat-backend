const http = require('http');
const { Server } = require('socket.io');
const app = require('@src/router');

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    'Access-Control-Allow-Origin': '*'
  }
});

const user = {}; // List of active users
io.on('connection', socket => {
  socket.on('SetUser', data => {
    user[data.userId] = socket.id;
  });

  socket.on('send private msg', data => {
    io.to(user[data.receiverId]).emit('receive private msg', data);
  });
});

module.exports = httpServer;
