const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const socketio = require('socket.io');

const app = express();

const router = require('./config/router');

// DB Setup
mongoose.connect('mongodb://localhost:test', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, '..', '..', 'build')));

router(app);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'build', 'index.html'));
});

// Server Setup
const port = process.env.PORT || 8080;
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected')
  });

  socket.on('user_reconnect', (data) => {
    socket.join(data);
  });

  socket.on('action', (action) => {
    const data = action.payload;
    switch (action.type) {
      case 'server/CHANGE_PHASE':
        io.in(action.id).emit('action', { payload: data, type: 'CHANGE_PHASE' });
        break;
      case 'server/CHANGE_TEAM':
        io.in(data.data.gameId).emit('action', { payload: data, type: 'CHANGE_TEAM' });
        break;
      case 'server/CREATE_GAME':
        socket.join(data.data.gameId);
        socket.emit('action', { payload: data, type: 'CREATE_GAME' });
        break;
      case 'server/JOIN_GAME':
        socket.join(data.data.gameId);
        io.in(data.data.gameId).emit('action', { payload: data, type: 'JOIN_GAME' });
        break;
      case 'server/LEAVE_GAME':
        socket.leave(data.data.gameId);
        io.in(data.data.gameId).emit('action', { payload: data, type: 'LEAVE_GAME' });
        break;
      case 'server/DELETE_GAME':
        socket.leave(data.data.gameId);
        socket.emit('action', { payload: data, type: 'DELETE_GAME' });
        break;
      case 'server/START_GAME':
        io.in(data.data.gameId).emit('action', { payload: data, type: 'START_GAME' });
        break;
      case 'server/ADD_CARD':
        io.in(data.data.gameId).emit('action', { payload: data, type: 'ADD_CARD' });
        break;
      case 'server/SET_MASTER':
        io.in(data.data.gameId).emit('action', { payload: data, type: 'SET_MASTER' });
        break;
      case 'server/SWAP_CARD':
        io.in(data.data.gameId).emit('action', { payload: data, type: 'SWAP_CARD' });
        break;
      case 'server/PLAY_CARD':
        io.in(data.data.gameId).emit('action', { payload: data, type: 'PLAY_CARD' });
        break;
      case 'server/PHASE_END':
        io.in(data.data.gameId).emit('action', { payload: data, previous: action.previous, type: 'PHASE_END' });
        break;
      case 'server/RESTART_ROUND':
        io.in(data.data.gameId).emit('action', { payload: data, type: 'RESTART_ROUND' });
        break;
      default:
        null;
    }
  });
});

server.listen(port);
console.log('Server listening on:', port);
