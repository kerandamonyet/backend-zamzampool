const express = require("express");
const authController = require("../controllers/authController");
const authRoutes = express.Router()

authRoutes.post('/auth/login', authController.login);

module.exports = authRoutes;