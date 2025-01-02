const adminModel = require('../models/adminModels');
const bcrypt = require('bcrypt');
const adminController = {};

// Create Admin
adminController.create = async (req, res) => {
    try {
        const { email, username, password, roleId, statusId } = req.body;
        console.log(email, username, password, roleId, statusId);
        
        // Generate salt
        const saltRounds = 10;
        const password_salt = await bcrypt.genSalt(saltRounds);

        // Hash the password with the generated salt
        const hashedPassword = await bcrypt.hash(password, password_salt);

        // Create Admin using adminModel
        const createData = await adminModel.create(email, username, hashedPassword, password_salt, roleId, statusId);

        return res.status(201).json({
            success: true,
            statusCode: '201',
            message: 'Admin created successfully',
        });

    } catch (error) {
        console.error('Error creating admin:', error);
        return res.status(500).json({
            success: false,
            statusCode: '500',
            message: 'Failed to create admin',
            error: error.message
        });
    }
};

// Get All Admins
adminController.getAll = async (req, res) => {
    try {
        const admins = await adminModel.getAllAdmins();
        return res.status(200).json({
            success: true,
            statusCode: '200',
            message: 'Admins retrieved successfully',
            data: admins
        });
    } catch (error) {
        console.error('Error retrieving admins:', error);
        return res.status(500).json({
            success: false,
            statusCode: '500',
            message: 'Failed to retrieve admins',
            error: error.message
        });
    }
};

// Find Admin by ID
adminController.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await adminModel.findById(id);
        console.log(id);
        console.log(admin.roleName);
        

        if (admin) {
            return res.status(200).json({
                success: true,
                statusCode: '200',
                message: 'Admin retrieved successfully',
                data: admin
            });
        } else {
            return res.status(404).json({
                success: false,
                statusCode: '404',
                message: 'Admin not found'
            });
        }
    } catch (error) {
        console.error('Error retrieving admin:', error);
        return res.status(500).json({
            success: false,
            statusCode: '500',
            message: 'Failed to retrieve admin',
            error: error.message
        });
    }
};

// Update Admin
adminController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, username, user_password, roleId, statusId } = req.body;

        const updateData = {
            email,
            username,
            roleId,
            statusId
        };

        if (user_password) {
            const saltRounds = 10;
            const password_salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(user_password, password_salt);
            updateData.password = hashedPassword; // Password dan salt hanya ditambahkan jika ada password baru
            updateData.password_salt = password_salt;
        }
        console.log(updateData);
        
        // Update admin using adminModel
        const updated = await adminModel.update(id, updateData);

        if (updated) {
            console.log("updated");
            
            // const updatedAdmin = await adminModel.findById(id); // Dapatkan data admin yang telah diperbarui
            return res.status(200).json({
                success: true,
                statusCode: '200',
                message: 'Admin updated successfully'
            });
        } else {
            return res.status(404).json({
                success: false,
                statusCode: '404',
                message: 'Admin not found'
            });
        }

    } catch (error) {
        console.error('Error updating admin:', error);
        return res.status(500).json({
            success: false,
            statusCode: '500',
            message: 'Failed to update admin',
            error: error.message
        });
    }
};

// Delete Admin by ID
adminController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminModel.delete(id);
console.log("ID ADMIN : ",id);

        if (result.affectedRows > 0) {
            console.log("deleted");
            
            return res.status(200).json({
                success: true,
                statusCode: '200',
                message: 'Admin deleted successfully'
            });
        } else {
            return res.status(404).json({
                success: false,
                statusCode: '404',
                message: 'Admin not found'
            });
        }
    } catch (error) {
        console.error('Error deleting admin:', error);
        return res.status(500).json({
            success: false,
            statusCode: '500',
            message: 'Failed to delete admin',
            error: error.message
        });
    }
};
// getTotalTicketSold
adminController.getTotalTicketSold = async (req, res) => {
    try {
        const { payment_status } = req.params; 

        // Query untuk mengambil jenis tiket dan jumlah tiket berdasarkan status pembayaran
        const tickets = await adminModel.getTicketsByStatus(payment_status);

        if (tickets.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: '404',
                message: `No tickets found with status '${payment_status}'`
            });
        }

        // Harga tiket hardcoded
        const ticketPrices = {
            premium: 30000,
            regular: 18000
        };

        let totalTicketsSold = 0;
        let totalRevenue = 0;

        // Menghitung total tiket dan total pendapatan berdasarkan jenis tiket
        tickets.forEach(ticket => {
            const price = ticketPrices[ticket.ticket_type] || 0;  // Mendapatkan harga tiket
            totalTicketsSold += ticket.ticket_count;              // Jumlah tiket terjual
            totalRevenue += ticket.ticket_count * price;          // Pendapatan dari tiket tersebut
        });

        return res.status(200).json({
            success: true,
            statusCode: '200',
            message: `Total tickets sold with status '${payment_status}'`,
            totalTicketsSold: totalTicketsSold,
            totalRevenue: totalRevenue
        });
    } catch (error) {
        console.error('Error fetching total tickets sold:', error);
        return res.status(500).json({
            success: false,
            statusCode: '500',
            message: 'Failed to retrieve total tickets sold',
            error: error.message
        });
    }
};

//get admin by token
adminController.getAdminByToken = async (req, res) => {
    try {
        const adminId = req.admin.id; // Ambil ID dari token
        console.log("ADMIN ID:", adminId);
        
        const admin = await adminModel.findByIdAdmin(adminId); // Ambil data admin lengkap
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        console.log(admin);

        // Kirim respons dengan informasi lengkap
        return res.status(200).json({
            success: true,
            id: admin.id,
            username: admin.username,
            email: admin.email,
            roleName: admin.roleName,      // Kirim nama role
            statusName: admin.statusName ,
            createdAt:admin.createdAt // Kirim nama status
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
adminController.checkRoleByIdWithToken = async (req, res) => {
    try {
        // Ambil token dari header authorization
        const adminId = req.admin.id;
        console.log("admin id",adminId);
        console.log("token: ",req.header.Authorization);
        
        
        // Validasi jika adminId tidak ada
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: 'Token is required!'
            });
        }

        // Panggil fungsi di model untuk memeriksa role berdasarkan token
        const role = await adminModel.checkRoleByIdWithToken(adminId);

        // Kirim response jika berhasil
        return res.status(200).json({
            success: true,
            message: 'Role fetched successfully!',
            role: role.roleName
        });

    } catch (error) {
        // Tangani error
        console.error('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = adminController;
