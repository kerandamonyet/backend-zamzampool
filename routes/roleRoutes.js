const express = require("express");
const roleController = require("../controllers/roleController");
const authMiddleware = require('../middleware/authMiddleware');
const roleRoutes = express.Router();

// Route untuk melihat semua role
<<<<<<< HEAD
roleRoutes.get('/role-get',
=======
roleRoutes.get('/role',
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.getAll);

// Route untuk membuat role baru
<<<<<<< HEAD
roleRoutes.post('/role-create',
=======
roleRoutes.post('/role',
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.create);

// Route untuk memperbarui role
<<<<<<< HEAD
roleRoutes.put('/role-update/:id',
=======
roleRoutes.put('/role/:id',
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.update);

// Route untuk menghapus role
<<<<<<< HEAD
roleRoutes.delete('/role-delete/:id',
=======
roleRoutes.delete('/role/:id',
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin, // Terapkan autentikasi hanya pada rute ini
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    roleController.delete);

module.exports = roleRoutes;
