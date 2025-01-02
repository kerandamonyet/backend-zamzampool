const scanModel = require('../models/scanModels'); // Sesuaikan nama file
const scanController = {};

scanController.isTicketValid = async (req, res) => {
    try {
        const { id } = req.params;

        // Validasi input
        if (!id) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "ID is required",
            });
        }

        console.log(id);

        // Panggil model dengan await
        const result = await scanModel.isTicketValid(id);

        if (!result) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Ticket not found",
            });
        }

        // Respon sukses
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Success",
            data: result,
        });

    } catch (error) {
        console.error(error);

        // Tangani error server
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: error.message,
        });
    }
};

module.exports = scanController;
