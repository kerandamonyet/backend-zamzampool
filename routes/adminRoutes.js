const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require('../middleware/authMiddleware')
const adminRoutes = express.Router();

// Terapkan middleware hanya pada rute yang memerlukan autentikasi
adminRoutes.get('/admin',
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    adminController.getAll);

adminRoutes.post('/admin',
    // authMiddleware.authenticateAdmin,
    // authMiddleware.isTokenBlacklisted,
    // authMiddleware.authorizeRole('super admin'),
    adminController.create);
adminRoutes.get('/admin/id/:id',
    // authMiddleware.authenticateAdmin,
    // authMiddleware.isTokenBlacklisted,
    // authMiddleware.authorizeRole('super admin'),
    adminController.getById);
adminRoutes.get('/admin/checkrole',
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    adminController.checkRoleByIdWithToken);

adminRoutes.put('/admin/:id', 
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    adminController.update);

adminRoutes.delete('/admin/:id', 
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    // authMiddleware.authorizeRole('super admin'),
    adminController.delete);

adminRoutes.get('/admin/total/:payment_status', 
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.getTotalTicketSold);

adminRoutes.get('/admin/info', 
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin','admin'),
    adminController.getAdminByToken);

module.exports = adminRoutes;
