const productRepository = require("./product-responsitory");
const prisma = require("../../config/db");


const createProduct = async (productData, image) => {
    // Ambil path gambar jika ada
    const product = await productRepository.create(productData, image);

    return product;
};

const updatedProduct = async (productId, productData, image) => {
    const product = await productRepository.update(productId, productData, image);

    return product;
}
const applyDiscount = async (productId, discountId) => {
    // Cari produk terlebih dahulu
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product) {
        throw new Error('Product not found');
    }

    // Cari informasi diskon
    const discount = await prisma.discount.findUnique({
        where: { id: discountId }
    });

    if (!discount) {
        throw new Error('Discount not found');
    }

    // Hitung harga diskon
    const discountAmount = (product.originalPrice * discount.discountValue) / 100;
    const discountPrice = product.originalPrice - discountAmount;

    // Update produk dengan diskon
    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
            discountId: discountId,
            discountPrice: discountPrice
        }
    });

    return updatedProduct;
};

const getProducts = async () => {
    return await prisma.product.findMany({
        include: {
            category: true,
            discount: true
        }
    });
};

module.exports = {
  getProducts,
  createProduct,
  applyDiscount,
  updatedProduct
};
