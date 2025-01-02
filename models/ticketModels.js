const connection = require('../config/db');
const moment = require('moment');

const Ticket = {
    create: (data, callback) => {
        const query = `
            INSERT INTO tickets (id, name, email, phone, entry_date, ticket_count, ticket_type, payment_status, last_request_time, isUsed, expired_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, 'not_used', ?)
        `;
        const now = new Date();
        const params = [data.id, data.name, data.email, data.phone, data.entry_date, data.ticket_count, data.ticket_type, now, data.expired_date];

        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error creating ticket:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    handleMidtransNotification: (req, res) => {
        const data = req.body;
        const signatureKey = req.headers['x-signature-key'];

        console.log('Received Midtrans notification:', data);

        // Ensure signature key is valid
        if (!verifySignatureKey(data, signatureKey)) {
            console.log('Invalid signature key');
            return res.status(403).json({ message: 'Invalid signature key' });
        }

        // Update payment status based on notification
        Ticket.updatePaymentStatus(data.order_id, data.transaction_status, (err, result) => {
            if (err) {
                console.error('Error updating payment status:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(200).json({ message: 'Payment status updated successfully' });
        });
    },

    updateTicketUsage: (id, status, callback) => {
        const query = `UPDATE tickets SET isUsed = ? WHERE id = ?`;
        const params = [status, id];

        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error updating ticket usage:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    updatePaymentStatus: (id, barcodeUrl, callback) => {
        const query = `UPDATE tickets SET payment_status = 'completed', barcode = ?, expired_date = ? WHERE id = ?`;
        const expiredDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expired date set to 7 days from now
        connection.query(query, [barcodeUrl, expiredDate, id], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    checkPaymentStatus: (id, callback) => {
        const query = `SELECT payment_status FROM tickets WHERE id = ?`; // Gunakan ? sebagai placeholder untuk id
        const params = [id];
    
        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error checking ticket usage:', err);
                return callback(err); // Kembalikan error jika terjadi masalah dalam query
            }
            if (result.length === 0) {
                return callback(new Error('No ticket found')); // Jika tidak ada tiket ditemukan
            }
    
            const ticket = result[0];
            if (ticket.payment_status === 'pending') {
                return callback(null, 'waiting for payment'); // Jangan gunakan Error jika tidak ada kesalahan
            } else if (ticket.payment_status === 'completed') {
                return callback(null, 'payment has been completed!'); // Kondisi sukses
            } else {
                return callback(new Error('Unknown payment status')); // Menangani status yang tidak dikenali
            }
        });
    },    

    checkTicketValidity: (id, callback) => {
    const query = `SELECT payment_status, isUsed FROM tickets WHERE id = ?`;
    const params = [id];

    connection.query(query, params, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return callback(err); // Jika terjadi error dalam query, kembalikan error
        }

        if (result.length === 0) {
            return callback(new Error('No ticket found')); // Jika tiket tidak ditemukan
        }

        const ticket = result[0];

        // Cek apakah tiket sudah dibayar dan belum digunakan
        if (ticket.payment_status !== 'completed') {
            return callback(new Error('Payment is not completed')); // Jika pembayaran belum selesai
        }

        if (ticket.isUsed === 'used') {
            return callback(new Error('Ticket has already been used')); // Jika tiket sudah digunakan
        }

        if (ticket.isUsed === 'expired') {
            return callback(new Error('Ticket has expired')); // Jika tiket sudah expired
        }

        // Jika tiket valid, update status tiket menjadi "used"
        const updateQuery = `UPDATE tickets SET isUsed = 'used' WHERE id = ?`;
        connection.query(updateQuery, [id], (err, result) => {
            if (err) {
                console.error('Error updating ticket usage to used:', err);
                return callback(err); // Jika terjadi error saat update status tiket
            }

            // Mengembalikan hasil yang sesuai setelah update status tiket
            return callback(null, 'Ticket is valid and marked as used');
        });
    });
},


    getTicketById: (id, callback) => {
        const query = `SELECT * FROM tickets WHERE id = ?`;
        const params = [id];

        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error getting ticket by ID:', err);
                return callback(err);
            }
            if (result.length === 0) {
                return callback(new Error('No ticket found'));
            }
            callback(null, result[0]);
        });
    },

    getEmailById: (id, callback) => {
        const query = `SELECT email FROM tickets WHERE id = ?`;
        const params = [id];

        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error getting email by ID:', err);
                return callback(err);
            }
            if (result.length === 0) {
                return callback(new Error('No ticket found with the given ID'));
            }
            callback(null, result[0].email);
        });
    },

    getLastRequestTime: (email, callback) => {
        const query = `SELECT last_request_time FROM tickets WHERE email = ? ORDER BY last_request_time DESC LIMIT 1`;
        const params = [email];

        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error getting last request time:', err);
                return callback(err);
            }
            // Return null if no result found
            callback(null, result.length > 0 ? result[0].last_request_time : null);
        });
    },

    updateTicketToExpired: (id, callback) => {
        const query = `
            UPDATE tickets 
            SET isUsed = 'expired' 
            WHERE id = ? AND expired_date < NOW()
        `;
        const params = [id];
    
        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error updating ticket to expired:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },
    
    checkExpiredDate: (id, callback) => {
        // Query untuk memeriksa apakah tiket sudah expired (lebih dari 7 hari sejak dibuat)
        const query = `
            SELECT id, expired_date, 
                   CASE 
                       WHEN DATE_ADD(expired_date, INTERVAL 7 DAY) < NOW() THEN 'expired' 
                       ELSE 'not_used' 
                   END AS isUsed
            FROM tickets
            WHERE id = ?
        `;
        const params = [id];
    
        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error checking ticket expiry:', err);
                return callback(err);
            }
    
            // Periksa apakah tiket ditemukan
            if (result.length === 0) {
                return callback(null, { success: false, message: 'Ticket not found' });
            }
    
            // Berikan hasil status tiket
            const ticket = result[0];
            callback(null, { 
                success: true, 
                message: `Ticket is ${ticket.isUsed}`, 
                isUsed: ticket.isUsed, 
                detail: ticket 
            });
        });
    },
    

    checkAndUpdateTicketUsage: (id, callback) => {
        const query = `SELECT isUsed, expired_date FROM tickets WHERE id = ?`;
        const params = [id];

        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error checking ticket usage:', err);
                return callback(err);
            }
            if (result.length === 0) {
                return callback(new Error('No ticket found'));
            }

            const ticket = result[0];
            if (ticket.isUsed === 'used') {
                return callback(new Error('Ticket already used'));
            }

            const now = new Date();
            const expiredDate = new Date(ticket.expired_date);
            //if ticket expired
            if (expiredDate < now) {
                const expireQuery = `UPDATE tickets SET isUsed = 'expired' WHERE id = ?`;
                connection.query(expireQuery, [id], (err) => {
                    if (err) {
                        console.error('Error updating ticket usage to expired:', err);
                        return callback(err);
                    }
                    return callback(new Error('Ticket has expired'));
                });
                return;
            }

            // Update ticket status to used
            const updateQuery = `UPDATE tickets SET isUsed = 'used' WHERE id = ?`;
            connection.query(updateQuery, [id], (err, result) => {
                if (err) {
                    console.error('Error updating ticket usage to used:', err);
                    return callback(err);
                }
                callback(null, result);
            });
        });
    },
    getAllTickets: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM tickets`;
    
            connection.query(query, (err, result) => {
                if (err) {
                    console.error('Error fetching tickets', err);
                    return reject(err); // Mengembalikan error jika query gagal
                }
                resolve(result); // Mengembalikan hasil query jika berhasil
            });
        });
    }, 
    
    searchTicket : (keyword,callback) => {
        const query = `
        SELECT * 
        FROM tickets
        WHERE id LIKE ?
        OR email LIKE ?
        OR ticket_type LIKE ?
        OR payment_status LIKE ?
        OR isUsed LIKE ?
        OR name LIKE ?
    `;
    const params = [`%${keyword}%`, `%${keyword}%`,`%${keyword}%`,`%${keyword}%`,`%${keyword}%`,`%${keyword}%`];
    
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Error searching tickets:', err);
            return callback(err);
        }
        callback(null, results);
    });
    },
    deleteTicketById : (id,callback) => {
        const query = `DELETE FROM tickets WHERE id = ?`

        const param = id;
        connection.query(query,param,(err,result) => {
            if (err) {
                console.error('Error deleting ticket:', err);
                return callback(err);
            }
            callback(null,result);
        });
    },

  // Fungsi untuk mengambil data dalam 1 hari terakhir
//   getOneDayItems: (callback) => {
//     const oneDayAgo = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
//     const query = 'SELECT * FROM tickets WHERE created_at >= ?';
//     connection.query(query, [oneDayAgo], (err, results) => {
//       if (err) return callback(err, null);
//       callback(null, results);
//     });
//   },

//   // Fungsi untuk mengambil data dalam 1 minggu terakhir
//   getOneWeekItems: (callback) => {
//     const oneWeekAgo = moment().subtract(1, 'weeks').format('YYYY-MM-DD HH:mm:ss');
//     const query = 'SELECT * FROM tickets WHERE created_at >= ?';
//     connection.query(query, [oneWeekAgo], (err, results) => {
//       if (err) return callback(err, null);
//       callback(null, results);
//     });
//   },

//   // Fungsi untuk mengambil data dalam 1 bulan terakhir
//   getOneMonthItems: (callback) => {
//     const oneMonthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss');
//     const query = 'SELECT * FROM tickets WHERE created_at >= ?';
//     connection.query(query, [oneMonthAgo], (err, results) => {
//       if (err) return callback(err, null);
//       callback(null, results);
//     });
//   }
 // Fungsi untuk mengambil data berdasarkan filter dinamis
 getFilteredItems: (filter, callback) => {
    let dateFilter;

    // Tentukan filter waktu berdasarkan parameter
    switch (filter) {
      case 'day':
        dateFilter = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'week':
        dateFilter = moment().subtract(1, 'weeks').format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'month':
        dateFilter = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'year': // Tambahkan opsi filter satu tahun
        dateFilter = moment().subtract(1, 'years').format('YYYY-MM-DD HH:mm:ss');
        break;
      default:
        return callback(new Error('Invalid filter'), null);
    }

    // Query database dengan filter waktu yang dipilih
    const query = 'SELECT * FROM tickets WHERE entry_date >= ?';
    connection.query(query, [dateFilter], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
}

};

module.exports = Ticket;
