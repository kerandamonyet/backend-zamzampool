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

router.get('/tickets/:id', ticketController.getTicketById);
router.put('/tickets/:id', ticketController.updateTicketToExpired);
router.get('/tickets/validation/:id', ticketController.checkTicketValidity);
// router.put('/tickets/usage-status/:id', ticketController.updateTicketUsage);
router.get('/tickets', ticketController.getAllTickets);
router.get('/tickets/search/by', ticketController.search);
router.delete('/tickets/:id', ticketController.deleteTicketById);
// router.get('/tickets/f/aday', ticketController.filterOneDay);
// router.get('/tickets/f/aweek', ticketController.filterOneWeek);
// router.get('/tickets/f/amonth', ticketController.filterOneMonth);
router.get('/tickets/f/filterby', ticketController.filterByTime);

module.exports = router;  // Mengexport router agar bisa digunakan di lainnya
