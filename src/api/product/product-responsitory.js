const prisma = require('../../config/db')

const findAll = async () => {
    return await prisma.product.findMany({});
}

const create = async (productData, image) => {
    const imagePath = image ? image.path : null;

    // Periksa apakah originalPrice ada
    if (!productData.originalPrice) {
        throw new Error("originalPrice is required.");
    }

    // Konversi originalPrice ke Decimal, pastikan formatnya benar
    const originalPrice = Number(productData.originalPrice);
    if (!originalPrice || isNaN(Number(originalPrice))) {
        throw new Error("Invalid originalPrice: Must be a valid number.");
    }

    const product = await prisma.product.create({
        data: {
            name: productData.name,
            originalPrice: originalPrice,
            stock: productData.stock || 0,
            image: imagePath,
            category: {
                connect: { id: productData.categoryId }
            }
        }
    });

    // Konversi Decimal ke Number sebelum mengembalikan response
    return {
        ...product,
        originalPrice: Number(product.originalPrice), 
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null
    };
};

module.exports = {
    findAll,
    create
}
