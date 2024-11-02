const statusModel = require('../models/statusModels');
const statusController = {};

// Create new status
statusController.create = async (req, res) => {
    try {
        const { status_type } = req.body;
        if (!status_type) {
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

        const existingStatus = await statusModel.findOneByName(status_type);
        if (existingStatus) {
<<<<<<< HEAD
            return res.status(400).json({ message: 'Status already exists!' });
=======
            return res.status(400).json({ 
                success: false,
                statusCode: '400',
                message: 'Status already exists!' 
            });
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
        }

        const createData = await statusModel.create(status_type);
        return res.status(201).json({
<<<<<<< HEAD
            message: 'New status successfully added!',
            data: { id: createData.id, status_type: createData.status_type }
=======
            success: true, 
            statusCode: '201',
            message: 'New status successfully added!',
            data: { 
                id: createData.id, 
                status_type: createData.status_type 
            }
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
        });

    } catch (error) {
        console.error(error);
<<<<<<< HEAD
        return res.status(500).json({ message: error.message });
=======
        return res.status(500).json({ 
            success: false,
            statusCode: '500',
            message: error.message 
        });
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
    }
};

// Get all statuses
statusController.getAll = async (req, res) => {
    try {
        const statuses = await statusModel.getAll();
<<<<<<< HEAD
        return res.status(200).json({ message: 'Statuses retrieved successfully!', data: statuses });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
=======
        return res.status(200).json({
            success: true,
            statusCode: '200',
            message: 'Statuses retrieved successfully!', 
            data: statuses 
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

// Update status
statusController.update = async (req, res) => {
    const { id } = req.params;
    const { status_type } = req.body;

    try {
        const getData = await statusModel.findOneById(id);
        if (!getData) {
<<<<<<< HEAD
            return res.status(404).json({ message: 'Status not found!' });
        }

        if (!status_type) {
            return res.status(400).json({ message: 'Field cannot be empty!' });
        }

        const updateData = await statusModel.update(id, status_type);
        return res.status(200).json({ message: 'Status successfully updated!', data: updateData });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
=======
            return res.status(404).json({
                success: false,
                statusCode: '404',
                message: 'Status not found!' 
            });
        }

        if (!status_type) {
            return res.status(400).json({ 
                success: false,
                statusCode: '400',
                message: 'Field cannot be empty!' 
            });
        }

        const updateData = await statusModel.update(id, status_type);
        return res.status(200).json({
            success: true,
            statusCode: '200',
            message: 'Status successfully updated!', 
            data: updateData 
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

// Delete status
statusController.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await statusModel.delete(id);
        if (deleteResult.affectedRows === 0) {
<<<<<<< HEAD
            return res.status(404).json({ message: 'Status not found!' });
        }

        return res.status(200).json({ message: 'Status deleted successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
=======
            return res.status(404).json({
                success: false,
                statusCode: '404',
                message: 'Status not found!' 
            });
        }

        return res.status(200).json({
            success: true,
            statusCode: '200',
            message: 'Status deleted successfully!' 
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

module.exports = statusController;
