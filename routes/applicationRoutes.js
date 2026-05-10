const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const UrgentJob = require('../models/UrgentJob');
const PartTimeJob = require('../models/PartTimeJob');

// Submit an application
router.post('/', async (req, res) => {
  try {
    const { jobId, jobType, workerId, employerId } = req.body;
    
    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, workerId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      jobId,
      jobType,
      workerId,
      employerId
    });

    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications for a specific job (Employer view)
router.get('/job/:jobId', async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('workerId', 'name email phone location')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications for a specific worker (Worker view)
router.get('/worker/:workerId', async (req, res) => {
  try {
    const applications = await Application.find({ workerId: req.params.workerId })
      .sort({ appliedAt: -1 });

    const populatedApplications = await Promise.all(
      applications.map(async (app) => {
        let jobDetails = null;
        if (app.jobType === 'Part-Time') {
          jobDetails = await PartTimeJob.findById(app.jobId);
        } else if (app.jobType === 'Urgent') {
          jobDetails = await UrgentJob.findById(app.jobId);
        }
        
        return {
          ...app.toObject(),
          job: jobDetails
        };
      })
    );

    res.json(populatedApplications);
  } catch (error) {
    console.error('Error fetching worker applications:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update application status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Auto-close logic for Urgent jobs
    if (status === 'Accepted' && application.jobType === 'Urgent') {
      const urgentJob = await UrgentJob.findById(application.jobId);
      if (urgentJob) {
        const acceptedApplicationsCount = await Application.countDocuments({
          jobId: application.jobId,
          status: 'Accepted'
        });

        if (acceptedApplicationsCount >= urgentJob.vacancies) {
          urgentJob.status = 'Closed';
          await urgentJob.save();
        }
      }
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
