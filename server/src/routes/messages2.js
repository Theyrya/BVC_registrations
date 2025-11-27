const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// POST /api/messages -> send a message (from contact form)
router.post('/', async (req, res) => {
  const { name, email, subject, body } = req.body;
  if (!name || !email || !body) return res.status(400).json({ msg: 'name, email and body required' });
  try {
    const pool = await getPool();
    const insert = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('subject', sql.NVarChar, subject || '')
      .input('body', sql.NVarChar, body)
      .query('INSERT INTO Messages (name,email,subject,body) OUTPUT INSERTED.* VALUES (@name,@email,@subject,@body)');
    res.json(insert.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to store message' });
  }
});

// GET /api/messages -> admin only list
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Messages ORDER BY createdAt DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch messages' });
  }
});

// DELETE /api/messages/:id -> admin only
router.delete('/:id', auth, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    await pool.request().input('id', sql.Int, id).query('DELETE FROM Messages WHERE id = @id');
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete' });
  }
});

// DELETE /api/messages -> admin only clear all
router.delete('/', auth, isAdmin, async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().query('DELETE FROM Messages');
    res.json({ msg: 'Cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to clear' });
  }
});

module.exports = router;
