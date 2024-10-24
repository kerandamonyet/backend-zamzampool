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
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

// Terapkan middleware autentikasi secara global KECUALI untuk login
app.use((req, res, next) => {
    if (req.path === '/api/auth-login') {
        return next(); // Abaikan middleware untuk rute login
    }
    authMiddleware.authenticateAdmin(req, res, next); // Terapkan middleware ke rute lain
});

// Daftarkan rute-rute lainnya
app.use('/api', ticketRoutes);
app.use('/api', adminRoutes);
app.use('/api', statusRoutes);
app.use('/api', roleRoutes);
app.use('/api', authRoutes);

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
