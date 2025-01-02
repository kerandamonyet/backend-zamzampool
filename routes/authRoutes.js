const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const authRoutes = express.Router()

authRoutes.post('/auth/login', authController.login);
authRoutes.post('/auth/logout', authController.logout);
authRoutes.post('/auth/login/check',
    authMiddleware.authenticateAdmin,
    authMiddleware.isTokenBlacklisted,
    (req,res) => {
        res.status(200).json({
            error:"No Error Found"
        })
    }
);

module.exports = authRoutes;