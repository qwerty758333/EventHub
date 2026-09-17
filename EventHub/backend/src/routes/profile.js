const express = require('express');

const db = require('../db/database');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get logged-in user's profile
router.get('/', authenticateToken, (req, res) => {
  try {
    const user = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          role,
          phone,
          created_at AS createdAt
        FROM users
        WHERE id = ?
      `)
      .get(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);

    res.status(500).json({
      message: 'Failed to fetch profile',
    });
  }
});

// Update logged-in user's profile
router.put('/', authenticateToken, (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Name is required',
      });
    }

    db.prepare(`
      UPDATE users
      SET
        name = ?,
        phone = ?
      WHERE id = ?
    `).run(
      name.trim(),
      phone ? phone.trim() : null,
      req.user.id
    );

    const updatedUser = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          role,
          phone,
          created_at AS createdAt
        FROM users
        WHERE id = ?
      `)
      .get(req.user.id);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);

    res.status(500).json({
      message: 'Failed to update profile',
    });
  }
});

module.exports = router;