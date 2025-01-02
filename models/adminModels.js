const { query } = require('express');
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
                INSERT INTO Admin (email, username, user_password, password_salt, roleId, statusId)
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
        const { email, username, roleId, statusId, password, password_salt } = updateData;

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

            if (updateData.password && updateData.password_salt) {
                query = `UPDATE Admin SET email = ?, username = ?, user_password = ?, password_salt = ?, roleId = ?, statusId = ? WHERE id = ?`;
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
        const query = `
            SELECT 
                a.id, 
                a.username, 
                a.email,
                a.createdAt,
                a.updatedAt, 
                r.role_name AS roleName,  -- Ambil nama role
                s.status_type AS statusName -- Ambil nama status
            FROM Admin a
            JOIN Role r ON a.roleId = r.id -- Hubungkan dengan tabel Role
            JOIN Status s ON a.statusId = s.id -- Hubungkan dengan tabel Status
            WHERE a.id = ?`; // Cari admin berdasarkan id
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

//find by id join
adminModel.findByIdAdmin = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                a.id, 
                a.username, 
                a.email,
                a.createdAt,
                a.updatedAt, 
                r.role_name AS roleName,  -- Ambil nama role
                s.status_type AS statusName -- Ambil nama status
            FROM Admin a
            JOIN Role r ON a.roleId = r.id -- Hubungkan dengan tabel Role
            JOIN Status s ON a.statusId = s.id -- Hubungkan dengan tabel Status
            WHERE a.id = ?`; // Cari admin berdasarkan id
        
        connection.query(query, [id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results[0]); // Ambil hasil pertama
        });
    });
};

//getAllAdmins
adminModel.getAllAdmins = () => {
    return new Promise((resolve, reject) => {
        const query = `
           SELECT 
        a.id, 
        a.username, 
        a.email, 
        a.createdAt,
        a.updatedAt,
        r.role_name AS roleName,  -- Ambil nama role
        s.status_type AS statusName -- Ambil nama status
    FROM Admin a
    JOIN Role r ON a.roleId = r.id -- Hubungkan dengan tabel Role
    JOIN Status s ON a.statusId = s.id`; // Hubungkan dengan tabel Status

        connection.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results); // Kembalikan semua hasil
        });
    });
};

adminModel.checkRoleByIdWithToken = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.role_name AS roleName 
            FROM admin a
            JOIN Role r ON a.roleId = r.id
            WHERE a.id = ?`; // Menggunakan parameter untuk menghindari SQL Injection

        // Eksekusi query di dalam Promise
        connection.query(query, [id], (error, results) => {
            if (error) {
                return reject(error); // Kirim error jika query gagal
            }

            if (results.length === 0) {
                return reject(new Error("Role not found!")); // Validasi jika hasil kosong
            }

            resolve(results[0]); // Kirim hasil roleName
        });
    });
}


module.exports = adminModel;
