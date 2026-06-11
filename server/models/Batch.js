const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  schedule: { type: String, trim: true },
  startTime: { type: String },
  endTime: { type: String },
  days: [{ type: String }],
  description: { type: String, trim: true },
  color: { type: String, default: '#6366f1' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema);
