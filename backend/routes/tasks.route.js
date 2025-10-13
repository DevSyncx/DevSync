const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// POST /api/tasks - Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ errors: [{ msg: 'Title is required' }] });
    }
    const task = new Task({
      title: title.trim(),
      description: description || '',
      status: status === 'completed' ? 'completed' : 'pending',
      deadline: deadline ? new Date(deadline) : undefined,
      userId: req.user.id,
    });
    const saved = await task.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Create task error:', err);
    return res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

// GET /api/tasks - Get tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (err) {
    console.error('Fetch tasks error:', err);
    return res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

// PUT /api/tasks/:id - Update a task (only owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    if (typeof req.body.title === 'string') updates.title = req.body.title.trim();
    if (typeof req.body.description === 'string') updates.description = req.body.description;
    if (typeof req.body.status === 'string' && ['pending','completed'].includes(req.body.status)) updates.status = req.body.status;
    if (typeof req.body.deadline !== 'undefined') updates.deadline = req.body.deadline ? new Date(req.body.deadline) : null;
    // Never allow changing userId via API

    const task = await Task.findOne({ _id: id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ errors: [{ msg: 'Task not found' }] });
    }

    Object.assign(task, updates);
    const saved = await task.save();
    return res.json(saved);
  } catch (err) {
    console.error('Update task error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ errors: [{ msg: 'Invalid task id' }] });
    }
    return res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

// DELETE /api/tasks/:id - Delete a task (only owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ errors: [{ msg: 'Task not found' }] });
    }
    return res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ errors: [{ msg: 'Invalid task id' }] });
    }
    return res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

module.exports = router;


