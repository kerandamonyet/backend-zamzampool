const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Route untuk membuat tiket
router.post('/tickets', ticketController.createTicket);

// Route untuk membuat pembayaran
// router.post('/payments', ticketController.createPayment);

// Route untuk notifikasi Midtrans
router.post('/midtrans-notification', ticketController.handleMidtransNotification);

// Route untuk scan barcode
router.post('/tickets/scan/', ticketController.scanBarcode);

// Route untuk memanggil data order id
router.post('/tickets/:id', ticketController.updatePaymentStatus);

module.exports = router;  // Mengexport router agar bisa digunakan di lainnya
