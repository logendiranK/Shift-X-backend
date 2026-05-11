const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
  origin: [
    'https://shift-x-frontend.vercel.app',
    'https://shift-x-frontend-1qmn3jkpp-logendiranks-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const urgentjobsRouter = require('./routes/urgentjobs');
const partTimeJobsRouter = require('./routes/partTimeJobs');
const applicationRoutes = require('./routes/applicationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/urgentjobs', urgentjobsRouter);
app.use('/api/part-time-jobs', partTimeJobsRouter);
app.use('/api/applications', applicationRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('ShiftX Backend Running Successfully');
});

// Server Start
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);