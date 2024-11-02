const express = require("express");
const statusController = require("../controllers/statusController");
const authMiddleware = require('../middleware/authMiddleware');
const statusRoutes = express.Router();

// Route untuk melihat semua status akun
<<<<<<< HEAD
statusRoutes.get('/status-get',
=======
statusRoutes.get('/status',
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin', 'admin'),
    statusController.getAll);

// Route untuk membuat status baru
<<<<<<< HEAD
statusRoutes.post('/status-create',
=======
statusRoutes.post('/status',
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin', 'admin'),
    statusController.create);

// Route untuk memperbarui status
<<<<<<< HEAD
statusRoutes.put('/status-update/:id',
=======
statusRoutes.put('/status/:id',
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin', 'admin'),
    statusController.update);

// Route untuk menghapus status
<<<<<<< HEAD
statusRoutes.delete('/status-delete/:id',
=======
statusRoutes.delete('/status/:id',
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin', 'admin'),
    statusController.delete);

module.exports = statusRoutes;
