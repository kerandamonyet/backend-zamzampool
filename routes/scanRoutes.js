const express = require('express');
const scanRoutes = express.Router();
const scanController = require('../controllers/scanController');

// Route untuk membuat tiket
// scanRoutes.get('/validation/:id', scanController.isTicketValid);

// Route untuk membuat pembayaran
// scanRoutes.post('/payments', ticketController.createPayment);

// Route untuk notifikasi Midtrans
// scanRoutes.post('/midtrans-notification', ticketController.handleMidtransNotification);

// // Route untuk scan barcode
// scanRoutes.post('/tickets/scan/', ticketController.scanBarcode);

// // Route untuk memanggil data order id
// scanRoutes.post('/tickets/:id', ticketController.updatePaymentStatus);

module.exports = scanRoutes;  // Mengexport router agar bisa digunakan di lainnya
