const adminModel = require('../models/adminModels');
const bcrypt = require('bcrypt');
const adminController = {};

// Create Admin
adminController.create = async (req, res) => {
    try {
        const { email, username, password, roleId, statusId } = req.body;

        // Generate salt
        const saltRounds = 10;
        const password_salt = await bcrypt.genSalt(saltRounds);

        // Hash the password with the generated salt
        const hashedPassword = await bcrypt.hash(password, password_salt);

        // Create Admin using adminModel
        const createData = await adminModel.create(email, username, hashedPassword, password_salt, roleId, statusId);

        return res.status(201).json({
            message: 'Admin created successfully',
        });

    } catch (error) {
        console.error('Error creating admin:', error);
        return res.status(500).json({
            message: 'Failed to create admin',
            error: error.message
        });
    }
};

// Get All Admins
adminController.getAll = async (req, res) => {
    try {
        const admins = await adminModel.getAll();
        return res.status(200).json({
            message: 'Admins retrieved successfully',
            data: admins
        });
    } catch (error) {
        console.error('Error retrieving admins:', error);
        return res.status(500).json({
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

        if (admin) {
            return res.status(200).json({
                message: 'Admin retrieved successfully',
                data: admin
            });
        } else {
            return res.status(404).json({
                message: 'Admin not found'
            });
        }
    } catch (error) {
        console.error('Error retrieving admin:', error);
        return res.status(500).json({
            message: 'Failed to retrieve admin',
            error: error.message
        });
    }
};

// Update Admin
adminController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, username, password, roleId, statusId } = req.body;

        const updateData = {
            email,
            username,
            roleId,
            statusId
        };

        if (password) {
            const saltRounds = 10;
            const password_salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, password_salt);
            updateData.password = hashedPassword; // Password dan salt hanya ditambahkan jika ada password baru
            updateData.password_salt = password_salt;
        }

        // Update admin using adminModel
        const updated = await adminModel.update(id, updateData);

        if (updated) {
            const updatedAdmin = await adminModel.findById(id); // Dapatkan data admin yang telah diperbarui
            return res.status(200).json({
                message: 'Admin updated successfully',
                data: updatedAdmin
            });
        } else {
            return res.status(404).json({
                message: 'Admin not found'
            });
        }

    } catch (error) {
        console.error('Error updating admin:', error);
        return res.status(500).json({
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

        if (result.affectedRows > 0) {
            return res.status(200).json({
                message: 'Admin deleted successfully'
            });
        } else {
            return res.status(404).json({
                message: 'Admin not found'
            });
        }
    } catch (error) {
        console.error('Error deleting admin:', error);
        return res.status(500).json({
            message: 'Failed to delete admin',
            error: error.message
        });
    }
};

module.exports = adminController;
