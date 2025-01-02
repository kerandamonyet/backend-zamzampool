const connection = require('../config/db'); // Pastikan koneksi diimpor

const scanModel = {};

scanModel.isTicketValid = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tickets WHERE id = ? LIMIT 1';
        connection.query(query, [id], (err, result) => {
            if (err) {
                return reject(err); // Error pada query
            }
            if (result.length === 0) {
                return resolve(null); // Data tidak ditemukan
            }
            resolve(result[0]); // Mengembalikan objek pertama
        });
    });
};

module.exports = scanModel;
