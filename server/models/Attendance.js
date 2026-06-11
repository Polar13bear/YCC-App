const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'absent' },
  note: { type: String, trim: true },
});

const AttendanceSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  records: [AttendanceRecordSchema],
  markedBy: { type: String, default: 'Admin' },
}, { timestamps: true });

// Unique attendance per batch per date
AttendanceSchema.index({ batch: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
