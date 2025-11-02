const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.farmerOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'farmer') return res.status(403).json({ message: 'Farmer role required' });
  next();
};
