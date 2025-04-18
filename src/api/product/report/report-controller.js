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

const createReportProduct = async (req, res) => {
    const {productId, quantity, report} = req.body
    try {
        const reportProduct = await reportService.createReportProduct(productId, quantity, report)
        res.status(200).json({message: 'Report created', data: reportProduct})
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

const getReportProduct = async (req, res) => {
    try {
        const report = await reportService.getReportProduct()
        res.status(200).json({message: 'Report found', data: report})
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

const createSalesReport = async (req, res) => {
    try {
      const { userId, reportDate } = req.body;
  
      if (!userId || !reportDate) {
        return res.status(400).json({ message: "userId dan reportDate wajib diisi." });
      }
  
      const salesReport = await reportService.createSalesReport(userId, reportDate);
  
      return res.status(201).json({
        message: "Laporan penjualan berhasil dibuat.",
        status: 200,
        data: salesReport,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  const getReportSales = async (req, res) => {
    try {
        const report = await reportService.getReportsales()

        return res.status(200).json({
            message: "Report found",
            status: 200,
            data:report
        })
    } catch (error) {
        
    }
  }

module.exports = {
    updateStock,
    getReportStock,
    createReportProduct,
    getReportProduct,
    createSalesReport,
    getReportSales
}