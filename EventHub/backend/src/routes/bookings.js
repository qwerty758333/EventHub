const express = require('express');
const db = require('../db/database');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/test', (req, res) => {
  res.json({
    message: 'Bookings route is working',
  });
});

router.get('/my', authenticateToken, (req, res) => {
  try {
    const bookings = db
      .prepare(`
        SELECT
          b.id,
          b.user_id AS userId,
          b.event_id AS eventId,
          b.booking_date AS bookingDate,
          b.number_of_seats AS numberOfSeats,
          b.total_price AS totalPrice,
          b.status,
          e.name AS eventName,
          e.image,
          e.date,
          e.time,
          e.location,
          e.category
        FROM bookings b
        JOIN events e
          ON b.event_id = e.id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
      `)
      .all(req.user.id);

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);

    res.status(500).json({
      message: 'Failed to fetch bookings',
    });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { eventId, numberOfSeats } = req.body;

    // 1. Validate input
    if (!eventId || !numberOfSeats) {
      return res.status(400).json({
        message: 'Event and number of seats are required',
      });
    }

    if (numberOfSeats < 1) {
      return res.status(400).json({
        message: 'Number of seats must be at least 1',
      });
    }

    // 2. Find the event
    const event = db
      .prepare(`
        SELECT *
        FROM events
        WHERE id = ?
      `)
      .get(eventId);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    // 3. Check available seats
    if (event.available_seats < numberOfSeats) {
      return res.status(400).json({
        message: 'Not enough seats available',
      });
    }

    // 4. Calculate total price
    const totalPrice = event.price * numberOfSeats;

    // 5. Create booking and reduce seats together
    const createBooking = db.transaction(() => {
      const bookingResult = db
        .prepare(`
          INSERT INTO bookings (
            user_id,
            event_id,
            number_of_seats,
            total_price,
            status
          )
          VALUES (?, ?, ?, ?, ?)
        `)
        .run(
          req.user.id,
          eventId,
          numberOfSeats,
          totalPrice,
          'CONFIRMED'
        );

      db.prepare(`
        UPDATE events
        SET available_seats = available_seats - ?
        WHERE id = ?
      `).run(numberOfSeats, eventId);

      return bookingResult.lastInsertRowid;
    });

    const bookingId = createBooking();

    // 6. Return booking information
    const booking = db
      .prepare(`
        SELECT
          b.id,
          b.user_id AS userId,
          b.event_id AS eventId,
          b.booking_date AS bookingDate,
          b.number_of_seats AS numberOfSeats,
          b.total_price AS totalPrice,
          b.status,
          e.name AS eventName
        FROM bookings b
        JOIN events e
          ON b.event_id = e.id
        WHERE b.id = ?
      `)
      .get(bookingId);

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });

  } catch (error) {
    console.error('Booking creation error:', error);

    res.status(500).json({
      message: 'Failed to create booking',
    });
  }
});

module.exports = router;