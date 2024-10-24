const connection = require('../config/db');

const statusModel = {};

// Create new status
statusModel.create = (status_type) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO status (status_type) VALUES (?)';
        connection.query(query, [status_type.toLowerCase()], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: results.insertId, status_type });
        });
    });
};

// Find one status by name
statusModel.findOneByName = (status_type) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM status WHERE status_type = ?';
        connection.query(query, [status_type.toLowerCase()], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]);  // Return first match
        });
    });
};

// Find one status by ID
statusModel.findOneById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM status WHERE id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]);  // Return first match
        });
    });
};

// Update status
statusModel.update = (id, status_type) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE status SET status_type = ? WHERE id = ?';
        connection.query(query, [status_type.toLowerCase(), id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Delete status
statusModel.delete = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM status WHERE id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Get all statuses
statusModel.getAll = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM status';
        connection.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);  // Return all statuses
        });
    });
};

module.exports = statusModel;
