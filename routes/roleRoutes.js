const express = require("express");
const roleController = require("../controllers/roleController");
const authMiddleware = require('../middleware/authMiddleware');
const roleRoutes = express.Router();

// Middleware untuk otentikasi
roleRoutes.use(authMiddleware.authenticateAdmin);

// Route untuk melihat semua role
roleRoutes.get('/role-get',
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.getAll);

// Route untuk membuat role baru
roleRoutes.post('/role-create',
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.create);

// Route untuk memperbarui role
roleRoutes.put('/role-update/:id',
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.update);

// Route untuk menghapus role
roleRoutes.delete('/role-delete/:id',
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.delete);

module.exports = roleRoutes;
