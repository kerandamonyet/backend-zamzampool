const connection = require('../config/db');

const Ticket = {
    create: (data, callback) => {
        const query = `INSERT INTO tickets (id, name, email, phone, entry_date, ticket_count, ticket_type, payment_status, last_request_time, isUsed, expired_date)
                       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, 'not_used', ?)`;
        const now = new Date();
        const params = [data.id, data.name, data.email, data.phone, data.entry_date, data.ticket_count, data.ticket_type, now, data.expired_date];
        connection.query(query, params, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    updatePaymentStatus: (id, barcode, entry_date, callback) => {
        const expiredDate = new Date(entry_date);
        expiredDate.setDate(expiredDate.getDate() + 3);
        const query = `UPDATE tickets SET payment_status = 'completed', barcode = ?, expired_date = ? WHERE id = ?`;
        const params = [barcode, expiredDate, id];
        connection.query(query, params, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    updateTicketUsage: (id, status, callback) => {
        const query = `UPDATE tickets SET isUsed = ? WHERE id = ?`;
        const params = [status, id];
        connection.query(query, params, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    getTicketById: (id, callback) => {
        const query = `SELECT * FROM tickets WHERE id = ?`;
        const params = [id];
        connection.query(query, params, (err, result) => {
            if (err) return callback(err);
            if (result.length === 0) return callback(new Error('No ticket found'));
            callback(null, result[0]);
        });
    },
    
    // getTotalTicketSold: (payment_status, callback) => {
    //     const query = `SELECT SUM(ticket_count) AS total_tickets_sold FROM tickets WHERE payment_status = ?`;
    //     const params = [payment_status];
    //     connection.query(query, params, (err, result) => {
    //         if (err) return callback(err);
    //         if (result.length === 0 || result[0].total_tickets_sold === null) {
    //             return callback(new Error('No tickets found or no tickets sold with this status'));
    //         }
    //         callback(null, result[0].total_tickets_sold);
    //     });
    // },
    

    getEmailById: (id, callback) => {
        const query = `SELECT email FROM tickets WHERE id = ?`;
        const params = [id];
        connection.query(query, params, (err, result) => {
            if (err) return callback(err);
            if (result.length === 0) return callback(new Error('No ticket found with the given ID'));
            callback(null, result[0].email);
        });
    },

    getLastRequestTime: (email, callback) => {
        const query = `SELECT last_request_time FROM tickets WHERE email = ? ORDER BY last_request_time DESC LIMIT 1`;
        const params = [email];
        connection.query(query, params, (err, result) => {
            if (err) return callback(err);
            if (result.length === 0) return callback(null, null);
            callback(null, result[0].last_request_time);
        });
    },

    updateTicketToExpired: (id, callback) => {
        const query = `UPDATE tickets SET isUsed = 'expired' WHERE id = ?`;
        const params = [id];
        connection.query(query, params, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    checkAndUpdateTicketUsage: (id, callback) => {
        const query = `SELECT isUsed, expired_date FROM tickets WHERE id = ?`;
        const params = [id];
        connection.query(query, params, (err, result) => {
            if (err) return callback(err);
            if (result.length === 0) return callback(new Error('No ticket found'));

            const ticket = result[0];
            if (ticket.isUsed === 'used') return callback(new Error('Ticket already used'));

            const now = new Date();
            if (new Date(ticket.expired_date) < now) return callback(new Error('Ticket has expired'));

            const updateQuery = `UPDATE tickets SET isUsed = 'used' WHERE id = ?`;
            connection.query(updateQuery, [id], (err, result) => {
                if (err) return callback(err);
                callback(null, result);
            });
        });
    }
};

module.exports = Ticket;
