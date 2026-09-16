require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./db/database');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'EventHub API is running',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: 'connected',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EventHub API running on port ${PORT}`);
});