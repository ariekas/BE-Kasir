const barcodeService = require("./barcode-service");

const createBarcode = async (req, res) => {
  const { productId } = req.body;
  const { barcodeImg } = await barcodeService.generateBarcode(productId);
  try {
    res.set("Content-Type", "image/png");
    res.send(barcodeImg);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  createBarcode,
};