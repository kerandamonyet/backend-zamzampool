const connection = require('../config/db');  // Koneksi ke database

const roleModel = {};

// Create Role
roleModel.create = (role_name) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO role (role_name) VALUES (?)';
        connection.query(query, [role_name.toLowerCase()], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: results.insertId, role_name });
        });
    });
};

// Find One Role by name
roleModel.findOneByName = (role_name) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM role WHERE role_name = ?';
        connection.query(query, [role_name.toLowerCase()], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]);  // Return the first matching record
        });
    });
};

// Find One Role by id
roleModel.findOneById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM role WHERE id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]);  // Return the first matching record
        });
    });
};

// Get All Roles
roleModel.getAll = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM role';
        connection.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);  // Return all matching records
        });
    });
};

// Update Role
roleModel.update = (id, role_name) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE role SET role_name = ? WHERE id = ?';
        connection.query(query, [role_name.toLowerCase(), id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: results.insertId, role_name });
        });
    });
};

// Delete Role
roleModel.delete = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM role WHERE id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = roleModel;
