const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(409).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: 'Error creating user' });
      }

      const token = jwt.sign(
        { id: this.lastID, username },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '24h' }
      );

      res.status(201).json({ token, userId: this.lastID, username });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '24h' }
    );

    res.json({ token, userId: user.id, username: user.username });
  });
});

module.exports = router;




