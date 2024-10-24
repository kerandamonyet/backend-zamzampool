const express = require("express");
const statusController = require("../controllers/statusController");
const authMiddleware = require('../middleware/authMiddleware');
const statusRoutes = express.Router();

// Middleware untuk otentikasi
statusRoutes.use(authMiddleware.authenticateAdmin);

// Route untuk melihat semua status akun
statusRoutes.get('/status-get',
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    statusController.getAll);

// Route untuk membuat status baru
statusRoutes.post('/status-create',
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    statusController.create);

// Route untuk memperbarui status
statusRoutes.put('/status-update/:id',
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    statusController.update);

// Route untuk menghapus status
statusRoutes.delete('/status-delete/:id',
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    statusController.delete);

module.exports = statusRoutes;
