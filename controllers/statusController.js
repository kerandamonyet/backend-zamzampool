const statusModel = require('../models/statusModels');
const statusController = {};

// Create new status
statusController.create = async (req, res) => {
    try {
        const { status_type } = req.body;
        if (!status_type) {
            return res.status(400).json({ 
                success: false,
                statusCode: '400',
                message: 'Field cannot be empty!'
            });
        }

        const existingStatus = await statusModel.findOneByName(status_type);
        if (existingStatus) {
            return res.status(400).json({ 
                success: false,
                statusCode: '400',
                message: 'Status already exists!' 
            });
        }

        const createData = await statusModel.create(status_type);
        return res.status(201).json({
            success: true, 
            statusCode: '201',
            message: 'New status successfully added!',
            data: { 
                id: createData.id, 
                status_type: createData.status_type 
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            statusCode: '500',
            message: error.message 
        });
    }
};

// Get all statuses
statusController.getAll = async (req, res) => {
    try {
        const statuses = await statusModel.getAll();
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
    }
};

// Update status
statusController.update = async (req, res) => {
    const { id } = req.params;
    const { status_type } = req.body;

    try {
        const getData = await statusModel.findOneById(id);
        if (!getData) {
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
    }
};

// Delete status
statusController.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await statusModel.delete(id);
        if (deleteResult.affectedRows === 0) {
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
    }
};

module.exports = statusController;
