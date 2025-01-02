const connection = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authController = {};

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '1EWsLpHlQnsUrLudnZmBkOqXCSWesvNq';

authController.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari admin berdasarkan email
        const [adminLogin] = await connection.promise().query(`
            SELECT a.id, a.email, a.username, a.user_password, r.role_name, s.status_type 
            FROM admin a
            JOIN role r ON a.roleId = r.id
            JOIN status s ON a.statusId = s.id
            WHERE a.email = ?
        `, [email]);

        if (adminLogin.length === 0) {
            console.log("admin not found");
            
            return res.status(404).json({
                success: false,
                statusCode: '404',
                message: 'Admin not found',
            });
        }

        const admin = adminLogin[0]; // Ambil admin pertama dari hasil query

        // Bandingkan password yang diinput dengan yang ada di database
        const isPasswordValid = await bcrypt.compare(password, admin.user_password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                statusCode: '401',
                message: 'Invalid password',
            });
        }

        // Buat token JWT
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role_name,
                name:admin.username
            },
            JWT_SECRET,
            { expiresIn: '12h' }
        );
        console.log("login success");
        

        return res.status(200).json({
            success: true,
            statusCode: '200',
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            success: false,
            statusCode: '500',
            message: 'Internal server error',
            error: error.message
        });
    }
};

authController.logout = async (req, res) => {
    try {
        // Ambil token dari header Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // Pastikan token tersedia
        if (!token) {
            return res.status(400).json({ error: 'Bad Request: Token is required' });
        }

        // Tambahkan token ke daftar blacklist
        global.blacklistedTokens = global.blacklistedTokens || []; // Inisialisasi jika belum ada
        global.blacklistedTokens.push(token); // Masukkan token ke daftar blacklist
        console.log('Received token:', token);
        console.log('Blacklisted Tokens:', global.blacklistedTokens);
        
        // Kirim respons sukses
        res.status(200).json({success:true, message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({success:false, error: 'Internal Server Error' });
    }
};


module.exports = authController;
