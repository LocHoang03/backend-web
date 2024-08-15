const express = require('express');
const app = express();
require('dotenv').config();
const configDb = require('./configs/configdb.js');
const cors = require('cors');

const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const port = process.env.PORT || 4000;
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

const Router = require('./routes/index');
const { errorHandler } = require('./helpers/errorHandler');

configDb();

app.use('/', Router);

app.use(errorHandler);

const userNamespace = io.of('/user');
const adminNamespace = io.of('/admin');

userNamespace.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    socket.join(data.roomId);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    adminNamespace.emit('forceLeave', roomId);
    userNamespace.to(roomId).emit('forceLeave', roomId);
  });

  socket.on('receiveRoom', (data) => {
    adminNamespace.emit('room', data);
  });

  socket.on('chatCustomer', (data) => {
    adminNamespace.emit('chatCustomer', data);
  });

  socket.on('disconnect', () => {});
});

adminNamespace.on('connection', (socket) => {
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('deleteRoom', (data) => {
    socket.broadcast.emit('delete-room', data);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);

    adminNamespace.to(roomId).emit('forceLeave', roomId);
    userNamespace.to(roomId).emit('forceLeave', roomId);
  });

  socket.on('chatCustomer', (data) => {
    userNamespace.emit('chatCustomer', data);
  });

  socket.on('disconnect', () => {});
});

httpServer.listen(port, () => {
  console.log('listening on port ' + port);
});
