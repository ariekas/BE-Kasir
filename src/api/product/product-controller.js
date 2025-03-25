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

const applyDiscount = async (req, res) => {
    const { productId } = req.params;
    const { discountId } = req.body;
    try {
        const useDiscount = await productService.applyDiscount(productId, discountId);
        
        res.status(200).json({
            message: "Discount applied",
            status: 200,
            data: useDiscount
        })
    } catch (error) {
        res.status(401).json({
            error: error.message
        })
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json({
            message: "Products fetched",
            status: 200,
            data: products
        })
    } catch (error) {
        res.status(401).json({
            error: error.message
        })
    }
}

module.exports = {
    createProduct,
    applyDiscount,
    getProducts
}