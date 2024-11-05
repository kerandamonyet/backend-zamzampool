const express = require('express');
const bodyParser = require('body-parser');
const ticketRoutes = require('./routes/ticketRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statusRoutes = require('./routes/statusRoutes');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware'); // Import middleware
const cors = require('cors');
const app = express();
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression()); // Compress all routes
// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
      },
    }),
);
  
// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// Daftarkan rute auth terlebih dahulu
app.use('/api/auth', authRoutes);

// Terapkan middleware autentikasi hanya pada rute /api/auth/login
app.use('/api/auth/login', authMiddleware.authenticateAdmin);

// Daftarkan rute-rute lainnya
app.use('/api', ticketRoutes);
app.use('/api', adminRoutes);
app.use('/api', statusRoutes);
app.use('/api', roleRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
