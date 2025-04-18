const prisma = require("../../../config/db");
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const axios = require("axios");

const sendReport = async (message) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }
    );
  } catch (error) {
    console.error("Failed to send Telegram message:", error.message);
  }
};

const updateStock = async (productId, stockQuantity) => {
  const getProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!getProduct) {
    throw new Error("Product not found");
  }

  const newStock = getProduct.stock + stockQuantity;

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
      stock: newStock,
    },
  });

  let message =
    `📢 Stok Produk Diperbarui \n\n` +
    `🛒 Produk: ${getProduct.name}\n` +
    `📦 Jumlah Ditambah: ${stockQuantity}\n` +
    `✅ Stok Sekarang: ${newStock}\n` +
    `📅 Tanggal: ${new Date().toLocaleString()}`;

  await sendReport(message);

  if (newStock <= 0) {
    let outOfStockMessage =
      `⚠️ Stok Habis! \n\n` +
      `🛒 Produk: ${getProduct.name}\n` +
      `❌ Stok Sekarang: 0\n` +
      `📅 Tanggal: ${new Date().toLocaleString()}`;
    await sendReport(outOfStockMessage);
  }

  return stockReport;
};

const getReportStock = async () => {
  const report = await prisma.stockReport.findMany();
  return report;
};

const createReportProduct = async (productId, quantity, report) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const reportproduct = await prisma.productReport.create({
    data: {
      reportDate: new Date(),
      report,
      quantity,
      productId,
    },
  });

  // Create the message string first
  const message =
    `📢⚠️ Laporan Produk Bermasalah \n\n` +
    `🛒 Produk: ${product.name}\n` +
    `📦 Jumlah: ${quantity}\n` +
    `✅ Deskripsi: ${report}\n`;


  await sendReport(message);

  return reportproduct;
};

const getReportProduct = async () => {
  const report = await prisma.productReport.findMany();
  return report;
};

const createSalesReport = async (userId, reportDate) => {
  const startDate = new Date(reportDate);
  startDate.setHours(0, 0, 0, 0); // Set ke awal hari (waktu lokal)

  const endDate = new Date(startDate);
  endDate.setHours(23, 59, 59, 999); // Set ke akhir hari (waktu lokal)

  // Ambil transaksi dengan status DONE dalam rentang waktu tertentu
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: userId,
      status: "DONE",
      transactionDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      transactionDate: true,
      totalPrice: true,
      status: true,
    },
  });

  // Hitung totalSales dan totalTransaction
  const totalSales = transactions.reduce((sum, trx) => sum + parseFloat(trx.totalPrice), 0);
  const totalTransaction = transactions.length;

  if (totalTransaction === 0) {
    throw new Error("Tidak ada transaksi yang selesai pada hari ini!");
  }

  return await prisma.salesReport.create({
    data: {
      reportDate: startDate,
      totalSales,
      totalTransaction,
    },
  });
};

const getReportsales = async () => {
  const report = await prisma.salesReport.findMany();
  return report;
};

module.exports = {
  updateStock,
  getReportStock,
  createReportProduct,
  getReportProduct,
  createSalesReport,
  getReportsales,
};
