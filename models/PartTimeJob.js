const mongoose = require('mongoose');

const partTimeJobSchema = new mongoose.Schema({
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        required: true
    },
    shiftDate: {
      type: Date,
      required: true
    },
    salary: {
        type: Number,
        required: true
    },
    shiftType: {
        type: String,
        required: true,
        enum: ['Morning: 8 AM – 12 PM', 'Afternoon: 1 PM – 5 PM', 'Evening: 5 PM – 10 PM', 'Weekend shifts only']
    },
    contactEmail: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        default: 'Part-time'
    },
    postedDate: {
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

module.exports = mongoose.model('PartTimeJob', partTimeJobSchema);
