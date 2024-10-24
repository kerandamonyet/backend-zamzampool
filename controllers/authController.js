const connection = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authController = {};

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

authController.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari admin berdasarkan email
        const [adminLogin] = await connection.promise().query(`
            SELECT a.id, a.email, a.username, a.password, r.role_name, s.status_type 
            FROM admin a
            JOIN role r ON a.roleId = r.id
            JOIN status s ON a.statusId = s.id
            WHERE a.email = ?
        `, [email]);

        if (adminLogin.length === 0) {
            return res.status(404).json({
                message: 'Admin not found',
            });
        }

        const admin = adminLogin[0]; // Ambil admin pertama dari hasil query

        // Bandingkan password yang diinput dengan yang ada di database
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password',
            });
        }

        // Buat token JWT
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role_name,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role_name,
                status: admin.status_type
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = authController;
