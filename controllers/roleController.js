const roleModel = require('../models/roleModels');
const roleController = {};

// Create new role
roleController.create = async (req, res) => {
    try {
        const { role_name } = req.body;

        if (!role_name) {
<<<<<<< HEAD
            return res.status(400).json({ message: 'Field cannot be empty!' });
=======
            return res.status(400).json({ 
                success: false,
                statusCode: '400',
                message: 'Field cannot be empty!' 
            });
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
        }

        // Check if role already exists
        const existingRoleName = await roleModel.findOneByName(role_name);
        if (existingRoleName) {
<<<<<<< HEAD
            return res.status(400).json({ message: 'Role already exists!' });
=======
            return res.status(400).json({ 
                success: false,
                statusCode: '400',
                message: 'Role already exists!' 
            });
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
        }

        // Create new role
        const createData = await roleModel.create(role_name);
<<<<<<< HEAD
        return res.status(201).json({ message: 'New role successfully added!', data: createData });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
=======
        return res.status(201).json({ 
            success: true,
            statusCode: '201',
            message: 'New role successfully added!', data: createData 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            statusCode: '500',
            message: error.message 
        });
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    }
};

// Get all roles
roleController.getAll = async (req, res) => {
    try {
        const roles = await roleModel.getAll();
<<<<<<< HEAD
        return res.status(200).json({ message: 'Roles retrieved successfully!', data: roles });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
=======
        return res.status(200).json({ 
            success: true,
            statusCode: '200',
            message: 'Roles retrieved successfully!', data: roles 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            statusCode: '500',
            message: error.message 
        });
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    }
};


// Update role
roleController.update = async (req, res) => {
    const { id } = req.params;
    const { role_name } = req.body;

    try {
        const existingRole = await roleModel.findOneById(id);
        if (!existingRole) {
<<<<<<< HEAD
            return res.status(404).json({ message: 'Role not found!' });
        }

        if (!role_name) {
            return res.status(400).json({ message: 'Field cannot be empty!' });
        }

        const updateData = await roleModel.update(id, role_name);
        return res.status(200).json({ message: 'Role successfully updated!', data: updateData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
=======
            return res.status(404).json({ 
                success: false,
                statusCode: '404',
                message: 'Role not found!' 
            });
        }

        if (!role_name) {
            return res.status(400).json({ 
                success: false,
                statusCode: '400',
                message: 'Field cannot be empty!' 
            });
        }

        const updateData = await roleModel.update(id, role_name);
        return res.status(200).json({ 
            success: true, 
            statusCode: '200',
            message: 'Role successfully updated!', data: updateData 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            statusCode: '500',
            message: error.message 
        });
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    }
};

// Delete role
roleController.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await roleModel.delete(id);
        if (deleteResult.affectedRows === 0) {
<<<<<<< HEAD
            return res.status(404).json({ message: 'Role not found!' });
        }

        return res.status(200).json({ message: 'Role deleted successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
=======
            return res.status(404).json({ 
                success: false,
                statusCode: '404',
                message: 'Role not found!' 
            });
        }

        return res.status(200).json({ 
            success: true,
            statusCode: '200',
            message: 'Role deleted successfully!' 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            statusCode: '500',
            message: error.message 
        });
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    }
};

module.exports = roleController;
