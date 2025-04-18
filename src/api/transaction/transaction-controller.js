const prisma = require("../../config/db");

// Create a new transaction (userId didapat dari token)
const createTransaction = async (req, res) => {
    try {
        const { memberId, transactionDetails, paymentMethod } = req.body;
        const userId = req.userId; // Dapatkan userId dari token

        // Ambil semua harga produk dari database
        const productIds = transactionDetails.map(detail => detail.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, originalPrice: true, discountPrice: true }
        });

        // Buat mapping harga produk berdasarkan ID
        const productPriceMap = {};
        products.forEach(product => {
            productPriceMap[product.id] = product.discountPrice ?? product.originalPrice;
        });

        // Hitung total harga tanpa diskon
        let totalPrice = 0;
        const transactionDetailsData = transactionDetails.map(detail => {
            const productPrice = productPriceMap[detail.productId] || 0;
            const totalDetailPrice = productPrice * detail.quantity;
            totalPrice += totalDetailPrice;
            return {
                quantity: detail.quantity,
                price: productPrice,
                totalPrice: totalDetailPrice,
                productId: detail.productId
            };
        });

        // Cek apakah user memiliki membership dan ambil diskon dari tabel Member
        let discountPercentage = 0;
        if (memberId) {
            const member = await prisma.member.findUnique({
                where: { id: memberId },
                select: { memberDiscount: true }
            });
            if (member) {
                discountPercentage = member.memberDiscount; // Misalnya 10 untuk 10%
            }
        }

        // Hitung total harga setelah diskon
        totalPrice = totalPrice * ((100 - discountPercentage) / 100);

        // Simpan transaksi dengan status default "pending"
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                memberId: memberId || null,
                transactionDate: new Date(),
                totalPrice,
                paymentMethod,
                status: "PENDING", // Status default
                transactionDetails: {
                    create: transactionDetailsData
                }
            },
            include: { transactionDetails: true }
        });

        res.status(201).json({
            message: "Transaction created successfully",
            status: 201,
            data: transaction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create transaction" });
    }
};

// Get all transactions for logged-in user
const getTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            include: { transactionDetails: true }
        });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
};

module.exports = {
    createTransaction,
    getTransactions
};
