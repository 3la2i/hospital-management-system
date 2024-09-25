const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check for x-auth-token first, then Authorization header
  const token = req.header('x-auth-token') || req.header('Authorization')?.split(' ')[1];

  console.log('Received token:', token); // For debugging

  if (!token) {
    console.log('No token found in headers'); // For debugging
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Decoded user:', req.user); // For debugging
    next();
  } catch (error) {
    console.error('Token verification error:', error); // For debugging
    res.status(401).json({ error: 'Token is not valid' });
  }
};