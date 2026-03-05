import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/todos').then(res => res.json()).then(setTodos);
    socket.on('todoAdded', (todo) => setTodos(prev => [...prev, todo]));
    return () => socket.off('todoAdded');
  }, []);

  const addTodo = (text) => {
    fetch('http://localhost:3001/todos', { method: 'POST', body: JSON.stringify({ text }), headers: { 'Content-Type': 'application/json' } });
  };

  return (
    <div>
      <h1>Real-Time Todos</h1>
      <ul>{todos.map(todo => <li key={todo._id}>{todo.text}</li>)}</ul>
      <button onClick={() => addTodo('New Task')}>Add Todo</button>
    </div>
  );
}

export default App;