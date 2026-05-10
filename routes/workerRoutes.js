const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = file.fieldname === 'profilePhoto' ? 'profiles' : 'aadhaar';
    cb(null, path.join(__dirname, `../uploads/${folder}`));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'profilePhoto' ? 'profile' : 'aadhaar';
    cb(null, `${prefix}_${req.params.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// ✅ Updated GET /:id route with aadhaarPhotoUrl
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const workerObj = worker.toObject();
    workerObj.aadhaarPhotoUrl = worker.aadhaarPhoto
      ? `${req.protocol}://${req.get('host')}${worker.aadhaarPhoto}`
      : '';
    workerObj.profilePhotoUrl = worker.profilePhoto
      ? `${req.protocol}://${req.get('host')}${worker.profilePhoto}`
      : '';

    res.json(workerObj);
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT route for updating profile and photos
router.put('/:id', upload.fields([{ name: 'aadhaarPhoto', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]), async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    if (!worker.aadhaarPhoto && (!req.files || !req.files['aadhaarPhoto'])) {
      return res.status(400).json({ error: 'Uploading Aadhaar card photo is compulsory.' });
    }

    const { name, email, phone, location, experience, hourlyRate, availability, skills, bio } = req.body;

    worker.name = name || worker.name;
    worker.email = email || worker.email;
    worker.phone = phone || worker.phone;
    worker.location = location || worker.location;
    worker.experience = experience || worker.experience;
    worker.hourlyRate = hourlyRate || worker.hourlyRate;
    worker.availability = availability || worker.availability;
    worker.skills = skills ? skills.split(',').map(skill => skill.trim()) : worker.skills;
    worker.bio = bio || worker.bio;

    if (req.files) {
      if (req.files['aadhaarPhoto']) {
        worker.aadhaarPhoto = `/uploads/aadhaar/${req.files['aadhaarPhoto'][0].filename}`;
      }
      if (req.files['profilePhoto']) {
        worker.profilePhoto = `/uploads/profiles/${req.files['profilePhoto'][0].filename}`;
      }
    }

    await worker.save();

    const workerObj = worker.toObject();
    workerObj.aadhaarPhotoUrl = worker.aadhaarPhoto
      ? `${req.protocol}://${req.get('host')}${worker.aadhaarPhoto}`
      : '';
    workerObj.profilePhotoUrl = worker.profilePhoto
      ? `${req.protocol}://${req.get('host')}${worker.profilePhoto}`
      : '';

    res.json(workerObj);
  } catch (error) {
    console.error('Error updating worker profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;