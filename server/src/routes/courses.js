const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Courses ORDER BY id');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to load courses' });
  }
});

// POST /api/courses (admin)
router.post('/', auth, isAdmin, async (req, res) => {
  const { code, name, term, credits, description } = req.body;
  try {
    const pool = await getPool();
    const insert = await pool.request()
      .input('code', sql.NVarChar, code)
      .input('name', sql.NVarChar, name)
      .input('term', sql.NVarChar, term)
      .input('credits', sql.Int, credits)
      .input('description', sql.NVarChar, description)
      .query(`INSERT INTO Courses (code,name,term,credits,description)
              OUTPUT INSERTED.*
              VALUES (@code,@name,@term,@credits,@description)`);
    res.json(insert.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to create course' });
  }
});

// PUT /api/courses/:id (admin)
router.put('/:id', auth, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { code, name, term, credits, description } = req.body;
  try {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('code', sql.NVarChar, code)
      .input('name', sql.NVarChar, name)
      .input('term', sql.NVarChar, term)
      .input('credits', sql.Int, credits)
      .input('description', sql.NVarChar, description)
      .query(`UPDATE Courses SET code=@code, name=@name, term=@term, credits=@credits, description=@description, updatedAt=SYSUTCDATETIME() WHERE id=@id`);
    res.json({ msg: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update course' });
  }
});

// DELETE /api/courses/:id (admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    await pool.request().input('id', sql.Int, id).query('DELETE FROM Courses WHERE id=@id');
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete course' });
  }
});

module.exports = router;
