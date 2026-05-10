const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  jobType: {
    type: String,
    required: true,
    enum: ['Part-Time', 'Urgent']
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);
