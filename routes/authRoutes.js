const express = require("express");
const authController = require("../controllers/authController");
const authRoutes = express.Router()

<<<<<<< HEAD
authRoutes.post('/auth-login', authController.login);
=======
authRoutes.post('/auth/login', authController.login);
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)

module.exports = authRoutes;