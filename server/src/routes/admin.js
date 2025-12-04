const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// GET /api/admin/users -> list users (admin)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT id, username, email, firstName, lastName, phone, department, program, studentId, isAdmin, createdAt FROM Users ORDER BY id');
    res.json(result.recordset);
  } catch (err) {
    console.error('Failed to load users', err);
    res.status(500).json({ msg: 'Failed to load users' });
  }
});

// DELETE /api/admin/users/:id -> delete user (admin)
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    await pool.request().input('id', sql.Int, id).query('DELETE FROM Users WHERE id=@id');
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error('Failed to delete user', err);
    res.status(500).json({ msg: 'Failed to delete user' });
  }
});

module.exports = router;
