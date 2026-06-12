const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// GET attendance for a batch on a date
router.get('/', protect, async (req, res) => {
  try {
    const { batch, date } = req.query;
    const filter = {};
    if (batch) filter.batch = batch;
    if (date) filter.date = date;
    const attendance = await Attendance.find(filter)
      .populate('batch', 'name subject color')
      .populate('records.student', 'name rollNo')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET attendance stats for a student
router.get('/stats/:studentId', protect, async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const attendanceRecords = await Attendance.find({ batch: student.batch });
    let present = 0, absent = 0, late = 0;
    attendanceRecords.forEach(record => {
      const rec = record.records.find(r => r.student.toString() === studentId);
      if (rec) {
        if (rec.status === 'present') present++;
        else if (rec.status === 'absent') absent++;
        else if (rec.status === 'late') late++;
      }
    });
    const total = present + absent + late;
    res.json({ present, absent, late, total, percentage: total ? Math.round((present / total) * 100) : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET batch attendance summary
router.get('/summary/:batchId', protect, async (req, res) => {
  try {
    const { batchId } = req.params;
    const records = await Attendance.find({ batch: batchId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST mark/save attendance
router.post('/', protect, async (req, res) => {
  try {
    const { batch, date, records } = req.body;
    const existing = await Attendance.findOne({ batch, date });
    if (existing) {
      existing.records = records;
      const saved = await existing.save();
      return res.json(saved);
    }
    const attendance = new Attendance({ batch, date, records });
    const saved = await attendance.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
