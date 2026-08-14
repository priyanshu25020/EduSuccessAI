// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const academicRoutes = require('./routes/academicRoutes');
const behaviorRoutes = require('./routes/behaviorRoutes');
const socioEconomicRoutes = require('./routes/socioEconomicRoutes');
const studentRoutes = require('./routes/studentRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.get('/api/health', (_req, res) =>
  res.status(200).json({ status: 'ok', service: 'EduSuccess API', time: new Date() })
);

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/learning-behavior', behaviorRoutes);
app.use('/api/socio-economic', socioEconomicRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/ai', aiRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

module.exports = app;
