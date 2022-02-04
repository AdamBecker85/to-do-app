const express = require('express');
const app = express();
const socket = require('socket.io');
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running');
});

const tasks = [];

app.get('*', (req, res) => {
  res.send('Not found ...');
});

const io = socket(server);
io.on('connection', (socket) => {
  //console.log('a user connected ' + socket.id);
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    console.log(`User ${socket.id} adds ${task.name} taskId: ${task.id}`);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (id) => {
    console.log(`User ${socket.id} removes task ${id}`);
    tasks.splice(
      tasks.findIndex((task) => task.id === id),
      1
    );
    socket.broadcast.emit('removeTask', id);
  });

  socket.on('disconnect', () => {
    //console.log('Socket ' + socket.id +' left');
  });
});