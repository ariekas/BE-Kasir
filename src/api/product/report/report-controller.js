const reportService = require('./report-service')

const updateStock = async (req, res) => {
    const {productId, stockQuantity} = req.body
    try {
        const stockReport = await reportService.updateStock(productId, stockQuantity)
        res.status(200).json({message: 'Stock updated', data: stockReport})
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

const getReportStock = async (req, res) => {
    try {
        const report = await reportService.getReportStock()
        res.status(200).json({message: 'Report found', data: report})
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}



module.exports = {
    updateStock,
    getReportStock,
    createReportProduct,
    getReportProduct
}