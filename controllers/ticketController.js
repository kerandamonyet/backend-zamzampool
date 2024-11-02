const Ticket = require('../models/ticketModels');
const { sendEmail } = require('../utils/mailer');
const QRcode = require('qrcode');
const snap = require('../utils/midtrans');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const moment = require('moment'); // moment.js untuk mempermudah manipulasi waktu

const TICKET_PRICES = {
    premium: 30000,
    reguler: 18000
};

// Fungsi untuk membuat ID tiket dengan awalan yang sesuai
const generateTicketId = (ticket_type) => {
    const randomString = uuidv4().split('-')[0]; // Mengambil bagian pertama dari UUID sebagai string acak
    const timestamp = Date.now(); // Mengambil timestamp saat ini
    const prefix = ticket_type === 'premium' ? 'PRE' : 'REG'; // Menentukan awalan
    return `${prefix}${randomString}${timestamp}`; // Mengembalikan ID dengan awalan, string acak, dan timestamp
};

// Validator untuk email dengan domain khusus
const emailDomainValidator = (value) => {
    const allowedDomains = '@gmail.com';
    const emailDomain = value.substring(value.lastIndexOf('@'));
    if (!allowedDomains.includes(emailDomain)) {
        throw new Error('Email domain must be @gmail.com');
    }
    return true;
};

// Validator untuk nomor telepon Indonesia
const phoneValidator = (value) => {
    const phoneRegex = /^08\d{8,}$/; // Validasi nomor dengan format 08xxxxxxxxx
    if (!phoneRegex.test(value)) {
        throw new Error('Phone number must be in the format 08xxxxxxxxx');
    }
    return true;
};

// Validator untuk entry_date tidak boleh di masa lalu
const entryDateValidator = (value) => {
    const today = moment().startOf('day'); // Ambil tanggal hari ini tanpa waktu
    const entryDate = moment(value); // Ubah entry_date ke moment
    if (entryDate.isBefore(today)) {
        throw new Error('Entry date cannot be in the past');
    }
    return true;
};

exports.createTicket = [
    // Middleware validasi (sama seperti sebelumnya)
    body('name').isLength({ min: 3 }).notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email').custom(emailDomainValidator),
    body('phone').isLength({ min: 10 }).notEmpty().withMessage('Phone number is required').custom(phoneValidator),
    body('entry_date').isDate().withMessage('Entry date must be a valid date').custom(entryDateValidator), // Tambahkan validator ini
    body('ticket_count').isInt({ min: 1, max: 200 }).withMessage('Ticket count must be a positive integer'),
    body('ticket_type').isIn(['premium', 'reguler']).withMessage('Invalid ticket type'),

    // Controller logika
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, entry_date, ticket_count, ticket_type } = req.body;

        // Cek apakah pengguna sudah mengirim permintaan sebelumnya
        Ticket.getLastRequestTime(email, (err, lastRequestTime) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    statusCode: '500',
                    error: {
                        message: err.message
                    }
                });
            }

            const now = moment(); // Waktu saat ini
            const lastRequestMoment = lastRequestTime ? moment(lastRequestTime) : null; // Ubah ke moment jika ada

            // Tentukan durasi limit (misalnya, 60 menit)
            const limitDuration = 1; // dalam menit

            // Cek apakah sudah ada permintaan sebelumnya
            if (lastRequestMoment) {
                const duration = moment.duration(now.diff(lastRequestMoment)).asMinutes(); // Hitung durasi dalam menit

                // Jika durasi kurang dari limit, kembalikan pesan error
                if (duration < limitDuration) {
                    return res.status(429).send({
                        status: 'error',
                        statusCode: '429',
                        error: {
                            message: `You can only send a request once every ${limitDuration} minutes.`
                        }
                    });
                }
            }

            // Jika tidak ada masalah, lanjutkan untuk membuat tiket
            const ticketId = generateTicketId(ticket_type);

            Ticket.create({
                id: ticketId,
                name,
                email,
                phone,
                entry_date,
                ticket_count,
                ticket_type,
                last_request_time: now.format() // Simpan waktu permintaan terakhir
            }, (err, result) => {
                if (err) return res.status(500).send({
                    status: 'error',
                    statusCode: '500',
                    error: {
                        message: err,
                    }
                });

                // Hitung total harga
                const totalPrice = ticket_count * TICKET_PRICES[ticket_type];

                // Buat parameter untuk Midtrans
                const transactionDetails = {
                    order_id: ticketId,
                    gross_amount: totalPrice
                };

                const parameter = {
                    transaction_details: transactionDetails,
                    credit_card: {
                        secure: true
                    },
                    customer_details: {
                        first_name: name.split(' ')[0],
                        last_name: name.split(' ').slice(1).join(' '),
                        email,
                        phone
                    }
                };

<<<<<<< HEAD
                snap.createTransaction(parameter)
                    .then((transaction) => {
                        const redirectUrl = transaction.redirect_url;
=======
                if (!snap) {
                    return res.status(500).send({
                        status: 'error',
                        statusCode: '500',
                        error: {
                            message: 'Payment gateway is not initialized. Please try again later.'
                        }
                    });
                }
                
                snap.createTransaction(parameter)
                    .then((transaction) => {
                        const transactionToken = transaction.token;
                        const redirectUrl = transaction.redirect_url;
                        
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)

                        res.status(200).json({ 
                            status: 'success',
                            statusCode: '200',
                            data: {
<<<<<<< HEAD
=======
                                transaction_token: transactionToken,
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
                                redirect_url: redirectUrl
                            }
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({
                            status: 'error',
                            statusCode: '500',
                            error: {
                                message: err
                            }
                        });
                    });
            });
        });
    }
];

exports.createPayment = [
    // Middleware validasi
    body('ticketId').notEmpty().withMessage('Ticket ID is required'),

    // Controller logika
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                status: 'error',
                statusCode: '400',
                error: {
                    message: errors.array()
                }
             });
        }

        const { ticketId } = req.body;

        Ticket.getTicketById(ticketId, (err, ticket) => {
            if (err) return res.status(500).send({
                status: 'error',
                statusCode: '500',
                error: {
                    message: err
                }
            });

            const transactionDetails = {
                order_id: ticket.id,
                gross_amount: ticket.ticket_count * TICKET_PRICES[ticket.ticket_type] // Menghitung harga sesuai jenis tiket
            };

            const parameter = {
                transaction_details: transactionDetails,
                credit_card: {
                    secure: true
                },
                customer_details: {
                    first_name: ticket.name.split(' ')[0],
                    last_name: ticket.name.split(' ').slice(1).join(' '),
                    email: ticket.email,
                    phone: ticket.phone
                }
            };

            snap.createTransaction(parameter)
                .then((transaction) => {
<<<<<<< HEAD
=======
                    const transactionToken = transaction.token;
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
                    const redirectUrl = transaction.redirect_url;

                    // Kirim URL redirect tanpa referensi siklik
                    res.status(200).json({ 
                        status: 'success',
                        statusCode: '200',
                        data: {
<<<<<<< HEAD
=======
                            transaction_token: transactionToken,
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
                            redirect_url: redirectUrl
                        }
                     });
                })
                .catch((err) => {
                    if (!res.headersSent) {
                        res.status(500).send({
                            status: 'error',
                            statusCode: '500',
                            error: {
                                message: err
                            }
                        });
                    }
                });
        });
    }
];

// Fungsi handleMidtransNotification
exports.handleMidtransNotification = (req, res) => {
    const { order_id, transaction_status, fraud_status } = req.body;

    if (transaction_status === 'settlement' && fraud_status === 'accept') {
        const barcodeData = `${order_id}_${Date.now()}`;
        
        // Generate QR code data URL
        QRcode.toDataURL(barcodeData, (err, barcodeUrl) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    statusCode: '500',
                    error: {
                        message: 'Failed to generate QR code',
                        details: err.message
                    }
                });
            }

            // Retrieve ticket details to get the entry_date
            Ticket.getTicketById(order_id, (err, ticketDetails) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        statusCode: '500',
                        error: {
                            message: 'Failed to retrieve ticket details',
                            details: err.message
                        }
                    });
                }

                if (!ticketDetails) {
                    return res.status(404).send({
                        status: 'error',
                        statusCode: '404',
                        error: {
                            message: 'Ticket details not found'
                        }
                    });
                }

                const { email, name, phone, entry_date, ticket_count, ticket_type } = ticketDetails;

                // Update payment status and set expired date based on entry_date
                Ticket.updatePaymentStatus(order_id, barcodeUrl, entry_date, (err) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            statusCode: '500',
                            error: {
                                message: 'Failed to update payment status',
                                details: err.message
                            }
                        });
                    }

                    // Send email with barcode URL and complete data
                    sendEmail(email, barcodeUrl, name, phone, entry_date, ticket_count, ticket_type)
                        .then(() => {
                            res.status(200).send({
                                status: 'success',
                                statusCode: '200',
                                message: 'Email sent successfully'
                            });
                        })
                        .catch(err => {
                            res.status(500).send({
                                status: 'error',
                                statusCode: '500',
                                error: {
                                    message: 'Failed to send email',
                                    details: err.message
                                }
                            });
                        });
                });
            });
        });
    } else {
        res.status(200).send({
            status: 'success',
            statusCode: '200',
            message: `Payment notification received: ${transaction_status} - ${fraud_status}`
        });
    }
};

// Fungsi untuk memindai kode QR dan memverifikasi tiket
exports.scanBarcode = (req, res) => {
    const { barcode } = req.body; // Ambil barcode dari body request, ganti req.params jika barcode berasal dari parameter URL

    Ticket.getTicketById(barcode, (err, ticket) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                statusCode: '500',
                error: {
                    message: 'Failed to retrieve ticket',
                    details: err.message
                }
            });
        }

        if (!ticket) {
            return res.status(404).send({
                status: 'error',
                statusCode: '404',
                error: {
                    message: 'Ticket not found'
                }
            });
        }

        // Cek status tiket dan tanggal kadaluarsa
        const now = new Date();
        if (ticket.isUsed === 'used') {
            return res.status(400).json({
                status: 'error',
                statusCode: '400',
                error: {
                    message: 'Ticket already used'
                }
            });
        }

        if (new Date(ticket.expired_date) < now) {
            Ticket.updateTicketToExpired(ticket.id, (err) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        statusCode: '500',
                        error: {
                            message: 'Failed to update ticket status',
                            details: err.message
                        }
                    });
                }
        
                res.status(200).send({
                    status: 'success',
                    statusCode: '200',
                    message: 'Ticket has expired',
                    data: ticket
                });
            });
        } else {
            // Jika tiket valid dan belum digunakan, ubah status menjadi 'used'
            Ticket.updateTicketUsage(ticket.id, 'used', (err) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        statusCode: '500',
                        error: {
                            message: 'Failed to update ticket status',
                            details: err.message
                        }
                    });
                }

                res.status(200).send({
                    status: 'success',
                    statusCode: '200',
                    message: 'Ticket scanned successfully',
                    data: ticket
                });
            });
        }
    });
};
