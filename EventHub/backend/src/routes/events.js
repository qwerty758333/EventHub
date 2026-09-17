const express = require('express');
const db = require('../db/database');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

function requireOrganizer(req, res, next) {
  if (req.user.role !== 'ORGANIZER') {
    return res.status(403).json({
      message: 'Organizer access required',
    });
  }

  next();
}

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

router.post(
  '/',
  authenticateToken,
  requireOrganizer,
  (req, res) => {
    try {
      const {
        name,
        description,
        image,
        date,
        time,
        location,
        category,
        price,
        totalSeats,
      } = req.body;

      if (
        !name ||
        !description ||
        !date ||
        !time ||
        !location ||
        !category ||
        totalSeats === undefined
      ) {
        return res.status(400).json({
          message: 'All required event fields must be provided',
        });
      }

      if (Number(price) < 0) {
        return res.status(400).json({
          message: 'Price cannot be negative',
        });
      }

      if (Number(totalSeats) < 1) {
        return res.status(400).json({
          message: 'Total seats must be at least 1',
        });
      }

      const result = db
        .prepare(`
          INSERT INTO events (
            organizer_id,
            name,
            description,
            image,
            date,
            time,
            location,
            category,
            price,
            total_seats,
            available_seats
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
          req.user.id,
          name.trim(),
          description.trim(),
          image || null,
          date,
          time,
          location.trim(),
          category.trim(),
          Number(price) || 0,
          Number(totalSeats),
          Number(totalSeats)
        );

      const event = db
        .prepare(`
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
        `)
        .get(result.lastInsertRowid);

      res.status(201).json({
        message: 'Event created successfully',
        event,
      });

    } catch (error) {
      console.error('Event creation error:', error);

      res.status(500).json({
        message: 'Failed to create event',
      });
    }
  }
);

router.get(
  '/mine',
  authenticateToken,
  requireOrganizer,
  (req, res) => {
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
        WHERE organizer_id = ?
        ORDER BY date ASC
      `).all(req.user.id);

      res.json(events);
    } catch (error) {
      console.error('Error fetching organizer events:', error);

      res.status(500).json({
        message: 'Failed to fetch organizer events',
      });
    }
  }
);

router.get(
  '/:id/bookings',
  authenticateToken,
  requireOrganizer,
  (req, res) => {
    try {
      const event = db.prepare(`
        SELECT id, name
        FROM events
        WHERE id = ? AND organizer_id = ?
      `).get(req.params.id, req.user.id);

      if (!event) {
        return res.status(404).json({
          message: 'Event not found',
        });
      }

      const bookings = db.prepare(`
        SELECT
          b.id,
          b.user_id AS userId,
          u.name AS userName,
          u.email AS userEmail,
          u.phone AS userPhone,
          b.number_of_seats AS numberOfSeats,
          b.total_price AS totalPrice,
          b.booking_date AS bookingDate,
          b.status
        FROM bookings b
        JOIN users u
          ON b.user_id = u.id
        WHERE b.event_id = ?
        ORDER BY b.booking_date DESC
      `).all(req.params.id);

      res.json(bookings);
    } catch (error) {
      console.error('Error fetching event bookings:', error);

      res.status(500).json({
        message: 'Failed to fetch event bookings',
      });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  requireOrganizer,
  (req, res) => {
    try {
      const {
        name,
        description,
        image,
        date,
        time,
        location,
        category,
        price,
        totalSeats,
      } = req.body;

      if (
        !name ||
        !description ||
        !date ||
        !time ||
        !location ||
        !category
      ) {
        return res.status(400).json({
          message: 'All required event fields must be provided',
        });
      }

      const newPrice = price === undefined ? 0 : Number(price);
      const newTotalSeats = Number(totalSeats);

      if (!Number.isFinite(newPrice) || newPrice < 0) {
        return res.status(400).json({
          message: 'Price cannot be negative',
        });
      }

      if (!Number.isFinite(newTotalSeats) || newTotalSeats < 1) {
        return res.status(400).json({
          message: 'Total seats must be at least 1',
        });
      }

      const event = db.prepare(`
        SELECT
          total_seats,
          available_seats
        FROM events
        WHERE id = ? AND organizer_id = ?
      `).get(req.params.id, req.user.id);

      if (!event) {
        return res.status(404).json({
          message: 'Event not found',
        });
      }

      const bookedSeats = event.total_seats - event.available_seats;

      if (newTotalSeats < bookedSeats) {
        return res.status(400).json({
          message: 'Total seats cannot be less than already booked seats',
        });
      }

      const newAvailableSeats = newTotalSeats - bookedSeats;

      const updateResult = db.prepare(`
        UPDATE events
        SET
          name = ?,
          description = ?,
          image = ?,
          date = ?,
          time = ?,
          location = ?,
          category = ?,
          price = ?,
          total_seats = ?,
          available_seats = ?
        WHERE id = ? AND organizer_id = ?
      `).run(
        name.trim(),
        description.trim(),
        image || null,
        date,
        time,
        location.trim(),
        category.trim(),
        newPrice,
        newTotalSeats,
        newAvailableSeats,
        req.params.id,
        req.user.id
      );

      if (updateResult.changes === 0) {
        return res.status(404).json({
          message: 'Event not found',
        });
      }

      const updatedEvent = db.prepare(`
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
        WHERE id = ? AND organizer_id = ?
      `).get(req.params.id, req.user.id);

      res.json({
        message: 'Event updated successfully',
        event: updatedEvent,
      });
    } catch (error) {
      console.error('Event update error:', error);

      res.status(500).json({
        message: 'Failed to update event',
      });
    }
  }
);

router.delete(
  '/:id',
  authenticateToken,
  requireOrganizer,
  (req, res) => {
    try {
      const deleteEvent = db.transaction(() => {
        const event = db.prepare(`
          SELECT id
          FROM events
          WHERE id = ? AND organizer_id = ?
        `).get(req.params.id, req.user.id);

        if (!event) {
          return false;
        }

        db.prepare(`
          SELECT id
          FROM bookings
          WHERE event_id = ?
          LIMIT 1
        `).get(req.params.id);

        db.prepare(`
          DELETE FROM events
          WHERE id = ? AND organizer_id = ?
        `).run(req.params.id, req.user.id);

        return true;
      });

      const deleted = deleteEvent();

      if (!deleted) {
        return res.status(404).json({
          message: 'Event not found',
        });
      }

      res.status(200).json({
        message: 'Event deleted successfully',
      });
    } catch (error) {
      console.error('Event deletion error:', error);

      res.status(500).json({
        message: 'Failed to delete event',
      });
    }
  }
);

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