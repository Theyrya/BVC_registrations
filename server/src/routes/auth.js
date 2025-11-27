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
    const user = insert.recordset[0];
    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: false }, process.env.JWT_SECRET || 'devsecret');
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: false } });
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
      .query('SELECT id, username, email, firstName, lastName, passwordHash, isAdmin FROM Users WHERE username = @username');
    if (r.recordset.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
    const user = r.recordset[0];
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: !!user.isAdmin }, process.env.JWT_SECRET || 'devsecret');
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: !!user.isAdmin } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

module.exports = router;
