const Ticket = require('../models/ticketModels');
const { sendEmail } = require('../utils/mailer');
const snap = require('../utils/midtrans');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const crypto = require('crypto');
const Midtrans = require('midtrans-client');
const QRcode = require('qrcode');

const dotenv = require('dotenv');
const { error } = require('console');
dotenv.config();

const TICKET_PRICES = {
    premium: 30000,
    reguler: 18000
};

// Fungsi untuk membuat ID tiket
const generateTicketId = (ticket_type) => {
    const randomString = uuidv4().split('-')[0];
    const timestamp = Date.now();
    const prefix = ticket_type === 'premium' ? 'PRE' : 'REG';
    return `${prefix}${randomString}${timestamp}`;
};

// Validator untuk email, nomor telepon, dan tanggal
const emailDomainValidator = (value) => {
    const allowedDomain = '@gmail.com';
    if (!value.endsWith(allowedDomain)) {
        throw new Error(`Email domain must be ${allowedDomain}`);
    }
    return true;
};

const phoneValidator = (value) => {
    const phoneRegex = /^08\d{8,}$/;
    if (!phoneRegex.test(value)) {
        throw new Error('Phone number must be in the format 08xxxxxxxxx');
    }
    return true;
};

const entryDateValidator = (value) => {
    const today = moment().startOf('day');
    const entryDate = moment(value);
    if (entryDate.isBefore(today)) {
        throw new Error('Entry date cannot be in the past');
    }
    return true;
};

// Function to verify Midtrans notification
const verifySignatureKey = (data, signatureKey) => {
    const payload = `${data.order_id}${data.status_code}${data.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`;
    const computedSignatureKey = crypto.createHash('sha512').update(payload).digest('hex');
    return computedSignatureKey === signatureKey;
};

exports.createTicket = [
    body('name').isLength({ min: 3 }).notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email').custom(emailDomainValidator),
    body('phone').isLength({ min: 10 }).notEmpty().withMessage('Phone number is required').custom(phoneValidator),
    body('entry_date').isDate().withMessage('Entry date must be a valid date').custom(entryDateValidator),
    body('ticket_count').isInt({ min: 1, max: 200 }).withMessage('Ticket count must be a positive integer'),
    body('ticket_type').isIn(['premium', 'reguler']).withMessage('Invalid ticket type'),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, entry_date, ticket_count, ticket_type } = req.body;
        Ticket.getLastRequestTime(email, (err, lastRequestTime) => {
            if (err) return res.status(500).send({ error: err.message });

            const now = moment();
            const lastRequestMoment = lastRequestTime ? moment(lastRequestTime) : null;
            const limitDuration = 1; // in minutes

            if (lastRequestMoment && moment.duration(now.diff(lastRequestMoment)).asMinutes() < limitDuration) {
                return res.status(429).send({ message: `You can only send a request once every ${limitDuration} minutes.` });
            }

            const ticketId = generateTicketId(ticket_type);
            const expiredDate = moment(entry_date).add(1, 'days').format('YYYY-MM-DD'); // Set the expired date
            Ticket.create({
                id: ticketId,
                name,
                email,
                phone,
                entry_date,
                ticket_count,
                ticket_type,
                expired_date: expiredDate,
                last_request_time: now.format()
            }, (err, result) => {
                if (err) return res.status(500).send({ error: err.message });

                const totalPrice = ticket_count * TICKET_PRICES[ticket_type];
                const transactionDetails = { order_id: ticketId, gross_amount: totalPrice };
                const itemDetails = [
                    {
                        id: ticketId,
                        price: TICKET_PRICES[ticket_type],
                        quantity: ticket_count,
                        name: ticket_type.charAt(0).toUpperCase() + ticket_type.slice(1) + ' Ticket'
                    }
                ];

                const parameter = {
                    transaction_details: transactionDetails,
                    item_details: itemDetails,
                    credit_card: { secure: true },
                    customer_details: {
                        first_name: name.split(' ')[0],
                        last_name: name.split(' ').slice(1).join(' '),
                        email,
                        phone,
                        entry_date,
                        ticket_count,
                        ticket_type
                    }
                };

                if (!snap) {
                    return res.status(500).send({ message: 'Payment gateway is not initialized. Please try again later.' });
                }

                snap.createTransaction(parameter)
                    .then((transaction) => {
                        res.status(200).json({
                            status: 'success',
                            transaction_token: transaction.token,
                            redirect_url: transaction.redirect_url
                        });
                    })
                    .catch((err) => res.status(500).send({ error: err.message }));
            });
        });
    }
];

exports.handleMidtransNotification = (req, res) => {
    const data = req.body;
    const signatureKey = req.headers['x-signature-key'];

    console.log('Received Midtrans notification:', data);

    if (!verifySignatureKey(data, signatureKey)) {
        console.log('Invalid signature key');
        return res.status(403).json({ message: 'Invalid signature key' });
    }

    const apiClient = new Midtrans.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    apiClient.transaction.notification(data)
        .then((statusResponse) => {
            const { order_id, transaction_status, fraud_status } = statusResponse;
            console.log(`Transaction notification: Order ID: ${order_id}, Transaction status: ${transaction_status}, Fraud status: ${fraud_status}`);

            // Update the payment status based on transaction status
            Ticket.updatePaymentStatus(order_id, transaction_status, (err) => {
                if (err) {
                    console.error('Error updating payment status:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                // Send email notification if needed
                Ticket.getTicketById(order_id, (err, ticket) => {
                    if (err) {
                        console.error('Failed to retrieve ticket:', err);
                        return res.status(500).send({ message: 'Failed to retrieve ticket' });
                    }

                    if (ticket) {
                        // Generate QR code URL
                        const qrCodeUrl = `https://example.com/qr/${ticket.id}`; // Adjust URL as needed

                        sendEmail(ticket.email, qrCodeUrl, ticket.name, ticket.phone, ticket.entry_date, ticket.ticket_count, ticket.ticket_type)
                            .then(() => res.status(200).json({ message: 'Payment status updated successfully and email sent.' }))
                            .catch(err => {
                                console.error('Failed to send email:', err);
                                res.status(500).send({ message: 'Failed to send email' });
                            });
                    } else {
                        res.status(404).json({ message: 'Ticket not found' });
                    }
                });
            });
        })
        .catch(err => {
            console.error('Error handling notification:', err);
            res.status(500).send({ message: 'Internal server error' });
        });
};


// Fungsi untuk memindai kode QR dan memverifikasi tiket
exports.scanBarcode = (req, res) => {
    const { barcode } = req.body;

    Ticket.getTicketById(barcode, (err, ticket) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to retrieve ticket' });
        }

        if (!ticket) {
            return res.status(404).send({ error: 'Ticket not found' });
        }

        const now = new Date();
        if (ticket.isUsed === 'used') {
            return res.status(400).json({ message: 'Ticket already used' });
        }

        if (new Date(ticket.expired_date) < now) {
            Ticket.updateTicketToExpired(ticket.id, (err) => {
                if (err) {
                    return res.status(500).send({ error: 'Failed to update ticket status' });
                }

                res.status(200).send({ message: 'Ticket has expired', data: ticket });
            });
        } else {
            Ticket.updateTicketUsage(ticket.id, 'used', (err) => {
                if (err) {
                    return res.status(500).send({ error: 'Failed to update ticket status' });
                }

                res.status(200).send({ message: 'Ticket successfully scanned', data: ticket });
            });
        }
    });
};

// Fungsi untuk update status payment setelah user kirim orderId
exports.updatePaymentStatus = (req, res) => {
    const { id } = req.params; // Get order ID from request parameters

    // Validate order ID
    if (!id) {
        return res.status(400).send({ 
            success: false,
            statusCode: '400',
            message: 'Order ID is required.' 
        });
    }

    // Fetch the ticket by ID to get its details
    Ticket.getTicketById(id, (err, ticket) => {
        if (err) {
            return res.status(500).send({ 
                status: false,
                statusCode: '500',
                error: 'Failed to retrieve ticket.' 
            });
        }

        // Generate QR code URL for the ticket
        const barcodeData = `${id}_${Date.now()}`;

        QRcode.toDataURL(barcodeData, (err, barcodeUrl) => {
            if (err) {
                console.error(`Failed to generate QR code for order_id=${id}: ${err.message}`);
                return res.status(500).json({
                    success: false,
                    statusCode: '500',
                    message: 'Failed to generate QR code',
                    detail: err.message
                });
            }

            // Update the payment status
            Ticket.updatePaymentStatus(id, barcodeUrl, (err) => {
                if (err) {
                    return res.status(500).send({ 
                        success: false,
                        statusCode: '500',
                        error: 'Failed to update payment status.' 
                    });
                }

                // Send the email with the ticket barcode
                sendEmail(ticket.email, barcodeUrl, ticket.name, ticket.phone, ticket.entry_date, ticket.ticket_count, ticket.ticket_type)
                    .then(() => {
                        res.status(200).send({ 
                            success: true,
                            statusCode: '200',
                            message: 'Payment status updated successfully and ticket barcode sent to email.' 
                        });
                    })
                    .catch(err => {
                        console.error('Failed to send email:', err);
                        res.status(500).send({ 
                            success: false,
                            statusCode: '500',
                            error: 'Failed to send ticket barcode email.' 
                        });
                    });
            });
        });
    });
};


// Fungsi untuk mendapatkan data berdasarkan orderId
exports.getOrderByOrderId = (req, res) => {
    const { id } = req.params;
    Ticket.getTicketById(id, (err, ticket) => {
        if (err) {
            return res.status(500).send({ 
                success: false,
                statusCode: '500',
                error: 'Failed to retrieve ticket' });
        }
        if (!ticket) {
            return res.status(404).send({ 
                success: false,
                statusCode: '404',
                message: 'Ticket not found' });
        }
        res.status(200).send({ 
            success: true,
            statusCode: '200',
            data: ticket 
        });
    });
};

///////
exports.getTicketById = async (req, res) => {
    const { id } = req.params;

    // Validasi ID untuk string alfanumerik dengan panjang minimum 1 karakter
    const idPattern = /^[a-zA-Z0-9]+$/;
    if (!id || !idPattern.test(id)) {
        return res.status(400).json({ message: 'Invalid ticket ID format' });
    }

    try {
        // Menggunakan fungsi findTicketById
        const ticket = await findTicketById(id);

        // Jika tiket tidak ditemukan
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }
        console.log(ticket.name);
        
        // Jika tiket ditemukan, kirim respons sukses
        res.status(200).json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        // Tangani error dari database atau proses lainnya
        console.error('Error fetching ticket:', error.message);

        res.status(500).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
};

// Controller
exports.updateTicketToExpired = (req, res) => {
    const ticketId = req.params.id;
    console.log(ticketId);
    
    // Validasi input untuk memastikan ID adalah angka
    if (!ticketId) {
        return res.status(400).json({
            success: false,
            message: 'ticket id not found.'
        });
    }

    // Memanggil fungsi updateTicketToExpired dari model
    Ticket.updateTicketToExpired(ticketId, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'failed update ticket to expired',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'ticket has not expired yet'
            });
        }

        // Berhasil memperbarui tiket
        res.status(200).json({
            success: true,
            message: 'ticket successfuly set to expired'
        });
    });
};


exports.checkTicketValidity = async (req, res) => {
    try {
        const { id } = req.params;
        // Mengambil detail tiket
        const detail = await findTicketById(id);
        if (detail.id === "no ticket found"){
            return res.status(404).json({
                success:false,
                message:"no ticket found",
                detail
            });
        }
        // Periksa status pembayaran
        if (detail.payment_status === "pending") {
            return res.status(400).json({
                success: false,
                message: "Payment is not completed",
                detail, // Tambahkan detail tiket
            });
        }
        //periksa kadaluarsa tiket 7 hari dari sekarang 
        const currentDate = new Date();
        const sevenDays = currentDate.setDate(currentDate.getDate()-7);

        //jika expired
        if(detail.expired_date <= sevenDays){
            const isUsed = "expired";
            updateTicketUsage(id,isUsed); 
            console.log(detail);
            
            return res.status(400).json({
                success: false,
                message: "ticket has been expired",
                detail
            });
        }else {
            // Periksa status penggunaan tiket
            if (detail.isUsed === "used"){
                return res.status(400).json({
                    success: false,
                    message: "ticket has been used",
                    detail
                });
            }else if (detail.isUsed === "not_used"){
                const isUsed = "used";
                updateTicketUsage(id,isUsed);
                return res.status(200).json({
                    success: true,
                    message: "ticket is valid",
                    detail
                });
            }
        }
        // Jika semua kondisi gagal (tidak seharusnya terjadi)
        return res.status(400).json({
            success: false,
            message: "Unknown ticket status",
            detail, // Tambahkan detail tiket
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
            detail: null, // Detail kosong jika error
        });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.getAllTickets();
        res.status(200).json({
            success:true,
            message:"success fetch tickets",
            data:tickets
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
};

exports.search = (req, res) => {
    const keyword = req.query.q || ''; // Ambil keyword dari query parameter
    console.log(keyword);
    
    Ticket.searchTicket(keyword, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error: err.message,
            });
        }

        // Jika tidak ada tiket yang ditemukan
        if (results === 'No ticket found') {
            return res.status(404).json({
                success: false,
                message: 'No ticket found',
            });
        }

        res.status(200).json({
            success: true,
            data: results,
        });
    });
};
exports.deleteTicketById = (req,res) => {
    const {id} = req.params;
    console.log("ID TICKET:",id);
    Ticket.deleteTicketById(id,(err,result)=>{
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }

        // Jika tidak ada tiket yang ditemukan
        if (result.affectedRows == 0) {
            console.log("no ticket found");
            
            return res.status(404).json({
                success: false,
                message: 'No ticket found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'successfuly deleted'
        });
    })
    
}

// Controller untuk filter data berdasarkan parameter
exports.filterByTime = (req, res) => {
  const { filter } = req.query; // Ambil parameter filter dari URL
console.log(filter);

  Ticket.getFilteredItems(filter, (err, items) => {
    if (err) {
        console.error(err);
        console.log(items);
        
      return res.status(500).json({
        success:false,
        message: `Error fetching data for ${filter} filter`,
        data:items
      });
    }
    console.log(items);
    
    res.json({
        success:true,
        message:`filter by 1 ${filter}`,
        data:items
    });
  });
};

// Controller untuk filter data 1 hari terakhir
// exports.filterOneDay = (req, res) => {
//     Ticket.getOneDayItems((err, items) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error fetching data for 1 day filter', error: err.message });
//       }
//       res.json(items);
//     });
//   };
  
//   // Controller untuk filter data 1 minggu terakhir
// exports.filterOneWeek = (req, res) => {
//     Ticket.getOneWeekItems((err, items) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error fetching data for 1 week filter', error: err.message });
//       }
//       res.json(items);
//     });
//   };
  
//   // Controller untuk filter data 1 bulan terakhir
// exports.filterOneMonth = (req, res) => {
//     Ticket.getOneMonthItems((err, items) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error fetching data for 1 month filter', error: err.message });
//       }
//       res.json(items);
//     });
//   };

///////
//promise untuk mendukung fungsi lain
const findTicketById = (id) => {
    return new Promise((resolve, reject) => {
        Ticket.getTicketById(id, (err, result) => {
            if (err) {
                reject(err); // Tolak Promise jika terjadi error
            } else {
                resolve(result); // Selesaikan Promise dengan hasil
            }
        });
    });
};
// Fungsi updateTicketUsage dengan Promise
const updateTicketUsage = (id, status) => {
    return new Promise((resolve, reject) => {
        Ticket.updateTicketUsage(id,status,(err,result) => {
            if (err) {
                reject(err); // Tolak Promise jika terjadi error
            } else {
                resolve(result); // Selesaikan Promise dengan hasil
            }
        })
    });
}
// const updateTicketToExpired = (id, update) => {
//     return new Promise((resolve, reject) => {
//         Ticket.updateTicketToExpired(id, update,(err, result) => {
//             if (err) {
//                 reject(err); // Tolak Promise jika terjadi error
//             } else {
//                 resolve(result); // Selesaikan Promise dengan hasil
//             }
//         });
//     });
// }
