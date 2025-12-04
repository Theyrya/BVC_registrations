const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../db');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { username, email, password, firstName, lastName, phone, birthday, department, program } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'username, email, password required' });
  try {
    const pool = await getPool();
    // check exists
    const exists = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM Users WHERE email = @email');
    if (exists.recordset.length > 0) return res.status(400).json({ error: 'Email already registered' });
    
    const hash = await bcrypt.hash(password, 10);
    const insert = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('passwordHash', sql.NVarChar, hash)
      .input('firstName', sql.NVarChar, firstName || '')
      .input('lastName', sql.NVarChar, lastName || '')
      .input('phone', sql.NVarChar, phone || '')
      .input('birthday', sql.DateTime, birthday ? new Date(birthday) : null)
      .input('department', sql.NVarChar, department || 'SD')
      .input('program', sql.NVarChar, program || '')
      .query(`INSERT INTO Users (username,email,passwordHash,firstName,lastName,phone,birthday,department,program,isAdmin,createdAt,updatedAt) 
              OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.firstName, INSERTED.lastName, INSERTED.isAdmin 
              VALUES (@username,@email,@passwordHash,@firstName,@lastName,@phone,@birthday,@department,@program,0,GETDATE(),GETDATE())`);
    let user = insert.recordset[0];
    // Generate a studentId using the inserted id: BVC + zero padded 6 digits (e.g. BVC000001)
    const generatedStudentId = `BVC${String(user.id).padStart(6, '0')}`;
    try {
      await pool.request().input('studentId', sql.NVarChar, generatedStudentId).input('id', sql.Int, user.id).query('UPDATE Users SET studentId = @studentId WHERE id = @id');
      // refresh user record to include studentId
      const refreshed = await pool.request().input('id', sql.Int, user.id).query('SELECT id, username, email, firstName, lastName, isAdmin, department, program, studentId FROM Users WHERE id = @id');
      if (refreshed.recordset.length > 0) user = refreshed.recordset[0];
    } catch (uErr) {
      console.warn('Failed to update generated studentId:', uErr.message || uErr);
    }

    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: false }, process.env.JWT_SECRET || 'devsecret');
    // return department/program/studentId (studentId should now be present)
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: false, department: user.department || null, program: user.program || null, studentId: user.studentId || user.id } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message || 'Signup failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT id, username, email, firstName, lastName, passwordHash, isAdmin, department, program, studentId FROM Users WHERE username = @username');
    if (r.recordset.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
    const user = r.recordset[0];
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: !!user.isAdmin }, process.env.JWT_SECRET || 'devsecret');
    // expose department/program/studentId if present in DB
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: !!user.isAdmin, department: user.department || null, program: user.program || null, studentId: user.studentId || user.id } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

module.exports = router;

// GET /api/auth/me - return current user based on Bearer token
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
    const token = auth.slice(7);
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, payload.id)
      .query('SELECT id, username, email, firstName, lastName, isAdmin, department, program, studentId FROM Users WHERE id = @id');
    if (r.recordset.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = r.recordset[0];
    res.json({ user: { id: user.id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: !!user.isAdmin, department: user.department || null, program: user.program || null, studentId: user.studentId || user.id } });
  } catch (err) {
    console.error('Auth me error:', err);
    res.status(500).json({ error: 'Failed to get current user' });
  }
});
