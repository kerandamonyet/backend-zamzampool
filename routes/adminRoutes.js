const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require('../middleware/authMiddleware')
const adminRoutes = express.Router()

adminRoutes.use(authMiddleware.authenticateAdmin)

adminRoutes.get('/admin-get',
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.getAll);
adminRoutes.post('/admin-create',
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.create);
adminRoutes.put('/admin-update/:id', 
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.update);
adminRoutes.delete('/admin-delete/:id', 
    authMiddleware.isTokenBlacklisted,
    authMiddleware.authorizeRole('super admin'),
    adminController.delete);

module.exports = adminRoutes