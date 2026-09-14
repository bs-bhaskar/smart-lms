const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const Note = require('../models/Note');
const Reminder = require('../models/Reminder');

// Study Bot routes
router.get('/notes', authenticateJWT, async (req, res) => {
  try {
    const notes = await Note.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

router.post('/notes', authenticateJWT, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Note content is required' });
    }
    const note = new Note({
      content,
      student: req.user.id,
      createdAt: new Date()
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note' });
  }
});

router.delete('/notes/:id', authenticateJWT, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      student: req.user.id 
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

router.delete('/reminders/:id', authenticateJWT, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid reminder ID' });
    }
    const reminder = await Reminder.findOneAndDelete({ 
      _id: req.params.id, 
      student: req.user.id 
    });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reminder' });
  }
});

router.post('/reminders', authenticateJWT, async (req, res) => {
  try {
    const { content, dueDate } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Reminder content is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ message: 'Due date is required' });
    }
    const reminder = new Reminder({
      content,
      dueDate,
      student: req.user.id,
      createdAt: new Date()
    });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reminder' });
  }
});

router.delete('/reminders/:id', authenticateJWT, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ 
      _id: req.params.id, 
      student: req.user.id 
    });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reminder' });
  }
});

module.exports = router;