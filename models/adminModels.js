const connection = require('../config/db');

const adminModel = {};

// Create Admin
adminModel.create = (email, username, hashedPassword, password_salt, roleId, statusId) => {
    return new Promise((resolve, reject) => {
        // Cek apakah email sudah ada di database
        const checkEmailQuery = `SELECT * FROM Admin WHERE email = ?`;
        connection.query(checkEmailQuery, [email], (error, results) => {
            if (error) {
                return reject(error);
            }

            if (results.length > 0) {
                // Jika email sudah ada, kembalikan error
                return reject(new Error('Email already exists'));
            }

            // Jika email belum ada, lanjutkan proses insert
            const query = `
                INSERT INTO Admin (email, username, password, password_salt, roleId, statusId)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            connection.query(query, [email, username, hashedPassword, password_salt, roleId, statusId], (error, results) => {
                if (error) {
                    return reject(error); // Reject the promise with the error
                }
                resolve(results); // Resolve the promise with the results
            });
        });
    });
};

// Update Admin
adminModel.update = (id, updateData) => {
    return new Promise((resolve, reject) => {
        const { email, username, password, password_salt, roleId, statusId } = updateData;

        // Cek apakah email sudah ada di database untuk user lain
        const checkEmailQuery = `SELECT * FROM Admin WHERE email = ? AND id != ?`;
        connection.query(checkEmailQuery, [email, id], (error, results) => {
            if (error) {
                return reject(error);
            }

            if (results.length > 0) {
                // Jika email sudah ada untuk user lain, kembalikan error
                return reject(new Error('Email already exists'));
            }

            // Jika email belum ada atau milik admin ini sendiri, lanjutkan update
            let query = `UPDATE Admin SET email = ?, username = ?, roleId = ?, statusId = ? WHERE id = ?`;
            let values = [email, username, roleId, statusId, id];

            if (password && password_salt) {
                query = `UPDATE Admin SET email = ?, username = ?, password = ?, password_salt = ?, roleId = ?, statusId = ? WHERE id = ?`;
                values = [email, username, password, password_salt, roleId, statusId, id];
            }

            connection.query(query, values, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    });
};


// Find Admin by ID
adminModel.findById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Admin WHERE id = ?`;
        connection.query(query, [id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results[0]); // Resolve the promise with the first result
        });
    });
};

// Delete Admin by ID
adminModel.delete = (id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Admin WHERE id = ?`;
        connection.query(query, [id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results); // Resolve with the results of the delete operation
        });
    });
};

// Get All Admins
adminModel.getAll = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Admin`;
        connection.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results); // Resolve the promise with the list of admins
        });
    });
};

adminModel.getTicketsByStatus = (payment_status) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT ticket_type, ticket_count FROM tickets WHERE payment_status = ?`;
        connection.query(query, [payment_status], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = adminModel;
