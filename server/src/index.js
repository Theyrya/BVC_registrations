require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const registrationsRoutes = require('./routes/registrations');
const messagesRoutes = require('./routes/messages');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/messages', messagesRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
