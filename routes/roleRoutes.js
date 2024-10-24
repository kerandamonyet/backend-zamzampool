const express = require("express");
const roleController = require("../controllers/roleController");
const authMiddleware = require('../middleware/authMiddleware');
const roleRoutes = express.Router();

// Route untuk melihat semua role
roleRoutes.get('/role-get',
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.getAll);

// Route untuk membuat role baru
roleRoutes.post('/role-create',
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.create);

// Route untuk memperbarui role
roleRoutes.put('/role-update/:id',
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.update);

// Route untuk menghapus role
roleRoutes.delete('/role-delete/:id',
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.delete);

module.exports = roleRoutes;
