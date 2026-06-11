const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNo: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  parentPhone: { type: String, trim: true },
  address: { type: String, trim: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  joinDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  photo: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
