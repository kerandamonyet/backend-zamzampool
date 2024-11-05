const connection = require('../config/db');

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
        const query = `UPDATE tickets SET isUsed = 'expired' WHERE id = ?`;
        const params = [id];

        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error updating ticket to expired:', err);
                return callback(err);
            }
            callback(null, result);
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
            if (new Date(ticket.expired_date) < now) {
                return callback(new Error('Ticket has expired'));
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
    }
};

module.exports = Ticket;
