const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'backend',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/project', (req, res) => {
  res.status(200).json({
    message: 'Capstone backend baseline ready.',
    nextStep: 'Define domain routes from your approved functional requirements.'
  });
});

module.exports = { app };