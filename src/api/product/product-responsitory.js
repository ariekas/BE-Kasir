const prisma = require('../../config/db')

const findAll = async () => {
    return await prisma.product.findMany({});
}


const create = async (productData, image) => {
    const imagePath = image ? image.path : null;

    // Periksa apakah originalPrice ada
    if (!productData.originalPrice) {
        throw new Error("original Price is required.");
    }

    // Konversi originalPrice ke Decimal, pastikan formatnya benar
    const originalPrice = Number(productData.originalPrice);
    if (!originalPrice || isNaN(Number(originalPrice))) {
        throw new Error("Invalid original Price: Must be a valid number.");
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

const update = async (productData, productId, image) => {
    // Ambil data produk yang ada
    const existingProduct = await prisma.product.findUnique({
        where:{id: productId}
    })
    console.log("Product ID:", productId);
    console.log("Existing Product:", existingProduct);

    if (!existingProduct) {
        throw new Error("Product tidak ditemukan");
    }

    // Gunakan image baru jika ada, jika tidak gunakan image lama
    const imagePath = image ? image.path : existingProduct.image;

    // Periksa dan konversi originalPrice jika ada
    let originalPrice = productData.originalPrice ? Number(productData.originalPrice) : existingProduct.originalPrice;
    if (isNaN(originalPrice)) {
        throw new Error("Invalid originalPrice: Must be a valid number.");
    }

    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
            name: productData.name || existingProduct.name,
            originalPrice: originalPrice,
            stock: productData.stock !== undefined ? productData.stock : existingProduct.stock,
            image: imagePath,
            category: productData.categoryId ? { connect: { id: productData.categoryId } } : undefined
        }
    });

    return {
        ...updatedProduct,
        originalPrice: Number(updatedProduct.originalPrice),
        discountPrice: updatedProduct.discountPrice ? Number(updatedProduct.discountPrice) : null
    };
};



module.exports = {
    findAll,
    create,
    update
}
