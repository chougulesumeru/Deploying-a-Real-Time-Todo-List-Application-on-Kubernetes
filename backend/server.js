const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB (env var for URL)
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/todos');

// Todo Schema
const Todo = mongoose.model('Todo', { text: String, completed: Boolean });

// API Routes
app.use(express.json());
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});
app.post('/todos', async (req, res) => {
  const todo = new Todo({ text: req.body.text, completed: false });
  await todo.save();
  io.emit('todoAdded', todo); // Real-time broadcast
  res.json(todo);
});
// Similar for PUT (update) and DELETE...

// WebSocket: Listen for connections and broadcast changes
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(3001, () => console.log('Backend on port 3001'));