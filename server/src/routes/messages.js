const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// POST /api/messages -> send a message (from contact form)
router.post('/', async (req, res) => {
  // Accepts { name, email, subject, body } but will adapt to different DB schemas
  const { name, email, subject, body } = req.body || {};
  try {
    const pool = await getPool();
    // Get columns present in Messages table
    const colInfo = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Messages'");
    const cols = (colInfo.recordset || []).map(r => (r.COLUMN_NAME || '').toLowerCase());

    // Try to derive sender info from auth token if present
    let fromUserId = null;
    let fromName = name || '';
    try {
      const header = req.headers.authorization || '';
      const token = header.replace('Bearer ', '').trim();
      if (token) {
        const jwt = require('jsonwebtoken');
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
        if (payload && payload.id) fromUserId = payload.id;
      }
    } catch (e) {
      // ignore token errors
    }

    // prefer explicit name param if provided
    if ((!fromName || fromName.trim() === '') && fromUserId) {
      // try to read user's name from DB
      try {
        const u = await pool.request().input('id', sql.Int, fromUserId).query('SELECT firstName, lastName, username, email FROM Users WHERE id = @id');
        if (u.recordset.length > 0) {
          const ru = u.recordset[0];
          fromName = ((ru.firstName || '') + ' ' + (ru.lastName || '')).trim() || ru.username || ru.email || '';
        }
      } catch (e) {}
    }

    // If the DB schema has columns 'message' and 'fromuserid', use that
    if (cols.includes('message') && cols.includes('fromuserid')) {
      const insert = await pool.request()
        .input('subject', sql.NVarChar, subject || '')
        .input('message', sql.NVarChar, body || '')
        .input('fromUserId', sql.Int, fromUserId || null)
        .input('fromName', sql.NVarChar, fromName || '')
        .query('INSERT INTO Messages (subject,message,fromUserId,fromName,createdAt) OUTPUT INSERTED.* VALUES (@subject,@message,@fromUserId,@fromName,GETDATE())');
      return res.json(insert.recordset[0]);
    }

    // If the DB schema matches seed (name,email,subject,body)
    if (cols.includes('name') && cols.includes('body')) {
      const insert = await pool.request()
        .input('name', sql.NVarChar, fromName || (name || ''))
        .input('email', sql.NVarChar, email || '')
        .input('subject', sql.NVarChar, subject || '')
        .input('body', sql.NVarChar, body || '')
        .query('INSERT INTO Messages (name,email,subject,body) OUTPUT INSERTED.* VALUES (@name,@email,@subject,@body)');
      return res.json(insert.recordset[0]);
    }

    // Fallback: try to insert subject and body into whichever columns exist
    if (cols.includes('subject') && (cols.includes('body') || cols.includes('message'))) {
      const q = cols.includes('body')
        ? 'INSERT INTO Messages (subject,body) OUTPUT INSERTED.* VALUES (@subject,@body)'
        : 'INSERT INTO Messages (subject,message) OUTPUT INSERTED.* VALUES (@subject,@message)';
      const reqInsert = pool.request().input('subject', sql.NVarChar, subject || '');
      if (cols.includes('body')) reqInsert.input('body', sql.NVarChar, body || '');
      if (cols.includes('message')) reqInsert.input('message', sql.NVarChar, body || '');
      const insert = await reqInsert.query(q);
      return res.json(insert.recordset[0]);
    }

    // If none matched, return a helpful error
    console.error('Messages table schema not supported. Columns:', cols);
    return res.status(500).json({ msg: 'Unsupported Messages schema on server' });
  } catch (err) {
    console.error('Failed to store message', err);
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
