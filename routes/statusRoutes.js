const express = require("express");
const statusController = require("../controllers/statusController");
const authMiddleware = require('../middleware/authMiddleware');
const statusRoutes = express.Router();

// Route untuk melihat semua status akun
statusRoutes.get('/status',
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin', 'admin'),
    statusController.getAll);

// Route untuk membuat status baru
statusRoutes.post('/status',
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin', 'admin'),
    statusController.create);

// Route untuk memperbarui status
statusRoutes.put('/status/:id',
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin', 'admin'),
    statusController.update);

// Route untuk menghapus status
statusRoutes.delete('/status/:id',
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin', 'admin'),
    statusController.delete);

module.exports = statusRoutes;
