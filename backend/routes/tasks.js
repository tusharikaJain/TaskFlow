const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

// GET /api/tasks - get all tasks for user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/tasks - create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      owner: req.user.id
    });

    await task.save();

    // Optionally emit socket event here

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/tasks/:id - update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.owner.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const fields = ['title','description','status','priority','dueDate'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.owner.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await task.remove();
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
