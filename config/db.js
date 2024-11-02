const mysql = require('mysql2');
<<<<<<< HEAD
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
=======
// const dotenv = require('dotenv');

// dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'ticket_online'
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

module.exports = connection;
