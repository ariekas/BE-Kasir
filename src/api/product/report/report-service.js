const prisma = require("../../../config/db");
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Ganti dengan token bot Telegram kamu
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const axios = require("axios");

const updateStock = async (productId, stockQuantity) => {
  const getProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!getProduct) {
    throw new Error("Product not found");
  }

  const stockReport = await prisma.stockReport.create({
    data: {
      reportDate: new Date(),
      productId: productId,
      stockQuantity: stockQuantity,
    },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      stock: getProduct.stock + stockQuantity,
    },
  });

  const message =
    `📢 *Stok Produk Diperbarui* \n\n` +
    `🛒 *Produk:* ${getProduct.name}\n` +
    `📦 *Jumlah Ditambah:* ${stockQuantity}\n` +
    `✅ *Stok Sekarang:* ${getProduct.stock + stockQuantity}\n` +
    `📅 *Tanggal:* ${new Date().toLocaleString()}`;
  await sendReport(message);

  return stockReport;
};



const getReportStock = async () => {
  const report = await prisma.stockReport.findMany();
  return report;
};



module.exports = {
  updateStock,
  getReportStock,
  createReportProduct,
  getReportProduct,
};
