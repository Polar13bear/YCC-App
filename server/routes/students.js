const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students (optionally filter by batch)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.batch) filter.batch = req.query.batch;
    if (req.query.active !== undefined) filter.isActive = req.query.active === 'true';
    const students = await Student.find(filter).populate('batch', 'name subject color').sort({ name: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('batch', 'name subject color');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();
    const populated = await saved.populate('batch', 'name subject color');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('batch', 'name subject color');
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
