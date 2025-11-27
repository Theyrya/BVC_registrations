const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../db');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ msg: 'username,email,password required' });
  try {
    const pool = await getPool();
    // check exists
    const exists = await pool.request().input('email', sql.NVarChar, email).query('SELECT id FROM Users WHERE email = @email');
    if (exists.recordset.length > 0) return res.status(400).json({ msg: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const insert = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hash)
      .query('INSERT INTO Users (username,email,password) OUTPUT INSERTED.id, INSERTED.username, INSERTED.email VALUES (@username,@email,@password)');
    const user = insert.recordset[0];
    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: false }, process.env.JWT_SECRET || 'devsecret');
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Signup failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'email and password required' });
  try {
    const pool = await getPool();
    const r = await pool.request().input('email', sql.NVarChar, email).query('SELECT id,username,email,password,isAdmin FROM Users WHERE email = @email');
    if (r.recordset.length === 0) return res.status(400).json({ msg: 'Invalid credentials' });
    const user = r.recordset[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: !!user.isAdmin }, process.env.JWT_SECRET || 'devsecret');
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: !!user.isAdmin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Login failed' });
  }
});

module.exports = router;
