const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token provided' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = payload; // { id, username, isAdmin }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalid' });
  }
};
