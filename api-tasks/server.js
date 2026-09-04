require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Tasks API is running' });
});

app.listen(PORT, () => {
});

process.on('SIGINT', () => {
  db.close((err) => {
    process.exit(0);
  });
});

