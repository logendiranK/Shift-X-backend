const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  jobType: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Urgent']
  },
  requirements: {
    type: [String],
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  durationHours: {
    type: Number,
    required: true
  },
  shiftDate: {
    type: Date,
    required: true
  },
  shiftStartTime: {
    type: String,
    required: true
  },
  shiftEndTime: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  vacancies: {
    type: Number,
    required: true,
    default: 1
  }
});

module.exports = mongoose.model('Job', jobSchema);
