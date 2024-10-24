const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = {};

authMiddleware.authenticateAdmin = (req, res, next) => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authorizationHeader.replace('Bearer ', '');

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.admin = decodedToken; // Simpan informasi admin yang terdecode dalam req.admin
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

// Middleware untuk otorisasi berdasarkan peran admin
authMiddleware.authorizeRole = (...requiredRoles) => {
  return (req, res, next) => {
    const { admin } = req;

    // Cek apakah role admin ada dan sesuai dengan yang diperlukan
    if (!admin || !requiredRoles.some(role => admin.role === role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }

    next();
  };
};

// Middleware untuk memeriksa apakah token diblacklist
authMiddleware.isTokenBlacklisted = (req, res, next) => {
  const { admin } = req;
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (admin && global.blacklistedTokens && global.blacklistedTokens.includes(token)) {
    return res.status(401).json({ error: 'Unauthorized: Token has been blacklisted' });
  }
  next();
};

module.exports = authMiddleware;
