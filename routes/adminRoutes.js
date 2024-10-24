const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require('../middleware/authMiddleware')
const adminRoutes = express.Router();

// Terapkan middleware hanya pada rute yang memerlukan autentikasi
adminRoutes.get('/admin-get',
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.getAll);

adminRoutes.post('/admin-create',
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.create);

adminRoutes.put('/admin-update/:id', 
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.update);

adminRoutes.delete('/admin-delete/:id', 
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.delete);

adminRoutes.get('/admin-total/:payment_status', 
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.getTotalTicketSold);

module.exports = adminRoutes;
