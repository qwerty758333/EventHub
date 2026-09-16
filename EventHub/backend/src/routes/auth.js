const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db/database');

const router = express.Router();


// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const existingUser = db
      .prepare('SELECT id FROM users WHERE email = ?')
      .get(email);

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = db
      .prepare(`
        INSERT INTO users (
          name,
          email,
          password,
          role,
          phone
        )
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        name,
        email,
        hashedPassword,
        'USER',
        phone || null
      );

    const user = {
      id: result.lastInsertRowid,
      name,
      email,
      role: 'USER',
      phone: phone || null,
    };

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user,
    });

  } catch (error) {
    console.error('Registration error:', error);

    res.status(500).json({
      message: 'Registration failed',
    });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = db
      .prepare(`
        SELECT *
        FROM users
        WHERE email = ?
      `)
      .get(email);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      message: 'Login successful',

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      message: 'Login failed',
    });
  }
});

module.exports = router;