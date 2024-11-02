const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require('../middleware/authMiddleware')
const adminRoutes = express.Router();

// Terapkan middleware hanya pada rute yang memerlukan autentikasi
<<<<<<< HEAD
adminRoutes.get('/admin-get',
=======
adminRoutes.get('/admin',
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.getAll);

<<<<<<< HEAD
adminRoutes.post('/admin-create',
=======
adminRoutes.post('/admin',
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.create);

<<<<<<< HEAD
adminRoutes.put('/admin-update/:id', 
=======
adminRoutes.put('/admin/:id', 
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.update);

<<<<<<< HEAD
adminRoutes.delete('/admin-delete/:id', 
=======
adminRoutes.delete('/admin/:id', 
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.delete);

<<<<<<< HEAD
adminRoutes.get('/admin-total/:payment_status', 
=======
adminRoutes.get('/admin/total/:payment_status', 
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.getTotalTicketSold);

module.exports = adminRoutes;
