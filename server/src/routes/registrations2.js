const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');
const auth = require('../middleware/auth');

// POST /api/registrations -> register a course for the current user
router.post('/', auth, async (req, res) => {
  const { courseId, term } = req.body;
  const studentId = req.user.id;
  if (!courseId || !term) return res.status(400).json({ msg: 'courseId and term required' });
  try {
    const pool = await getPool();
    const insert = await pool.request()
      .input('studentId', sql.Int, studentId)
      .input('courseId', sql.Int, courseId)
      .input('term', sql.NVarChar, term)
      .query('INSERT INTO Registrations (studentId,courseId,term) OUTPUT INSERTED.* VALUES (@studentId,@courseId,@term)');
    res.json(insert.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to register' });
  }
});

// GET /api/registrations?studentId= (admin) or current user
router.get('/', auth, async (req, res) => {
  const qStudentId = req.query.studentId;
  try {
    const pool = await getPool();
    if (req.user.isAdmin && qStudentId) {
      const result = await pool.request().input('studentId', sql.Int, qStudentId)
        .query('SELECT r.*, c.code, c.name FROM Registrations r JOIN Courses c ON r.courseId = c.id WHERE r.studentId = @studentId');
      return res.json(result.recordset);
    }
    // current user's registrations
    const result = await pool.request().input('studentId', sql.Int, req.user.id)
      .query('SELECT r.*, c.code, c.name FROM Registrations r JOIN Courses c ON r.courseId = c.id WHERE r.studentId = @studentId');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch registrations' });
  }
});

// DELETE /api/registrations/:id -> allow owner or admin
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const r = await pool.request().input('id', sql.Int, id).query('SELECT * FROM Registrations WHERE id = @id');
    if (r.recordset.length === 0) return res.status(404).json({ msg: 'Not found' });
    const reg = r.recordset[0];
    if (!req.user.isAdmin && reg.studentId !== req.user.id) return res.status(403).json({ msg: 'Not allowed' });
    await pool.request().input('id', sql.Int, id).query('DELETE FROM Registrations WHERE id=@id');
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete registration' });
  }
});

module.exports = router;
