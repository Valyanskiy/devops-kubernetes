const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://admin:password@mongodb:27017/tododb?authSource=admin';

mongoose.connect(mongoUri).then(() => console.log('Connected to MongoDB'));

const todoSchema = new mongoose.Schema({ title: String, completed: Boolean });
const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
  res.json(await Todo.find());
});

app.post('/todos', async (req, res) => {
  const todo = await Todo.create(req.body);
  res.status(201).json(todo);
});

app.get('/todos/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
