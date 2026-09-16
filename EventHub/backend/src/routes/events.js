const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Get all events
router.get('/', (req, res) => {
  try {
    const events = db.prepare(`
      SELECT
        id,
        name,
        description,
        image,
        date,
        time,
        location,
        category,
        price,
        available_seats AS availableSeats,
        total_seats AS totalSeats
      FROM events
      ORDER BY date ASC
    `).all();

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);

    res.status(500).json({
      message: 'Failed to fetch events',
    });
  }
});

// Get one event
router.get('/:id', (req, res) => {
  try {
    const event = db.prepare(`
      SELECT
        id,
        name,
        description,
        image,
        date,
        time,
        location,
        category,
        price,
        available_seats AS availableSeats,
        total_seats AS totalSeats
      FROM events
      WHERE id = ?
    `).get(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);

    res.status(500).json({
      message: 'Failed to fetch event',
    });
  }
});

module.exports = router;