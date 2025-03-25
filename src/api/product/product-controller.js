const productService = require("./product-service");

const createProduct = async (req, res) => {
    const productData = req.body;
    const image = req.file;
    try {
        const product = await productService.createProduct(productData, image);

        res.status(200).json({
            message: "Product created",
            status: 200,
            data: product
        })
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
}

module.exports = {
    createProduct,
}