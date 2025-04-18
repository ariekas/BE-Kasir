const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authController = require('./api/auth/auth-controller');
const userController = require('./api/user/user-controller');
const authMiddelware = require('./middelware/auth-middelware');
const categoryController = require('./api/product/category/category-controller');
const discountController = require('./api/product/discount/discount-controller')
const upload = require('./middelware/image-middelware')
const memberController = require('./api/user/member/member-controller');
const barcodeController = require('./api/product/barcode/barcode-controller');
const reportController = require('./api/product/report/report-controller');
const transactionController = require('./api/transaction/transaction-controller');
const cron = require("node-cron");
const { statusMember } = require("./api/user/member/member-service");
const productController = require('./api/product/product-controller');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const path = require('path');
setInterval(statusMember, 1000 * 60 * 60)
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // alamat frontend Laravel
}));

// Memulai cron job
cron.schedule("0 0 * * *", async () => {
    console.log("Memperbarui status member...");
    await statusMember();
    console.log("Status member berhasil diperbarui.");
});





app.post('/login', authController.login);
app.post('/logout', authMiddelware.verifyToken, authController.logout);

app.post('/create/user', authMiddelware.verifyToken, authMiddelware.verifyRole('ADMIN'), upload.single('profilePic'), userController.createUser);
app.put('/update/role/:userId', authMiddelware.verifyToken, authMiddelware.verifyRole('ADMIN'), userController.updateRole);
app.delete('/delete/user/:userId', authMiddelware.verifyToken, authMiddelware.verifyRole('ADMIN'), userController.deleteUser);
app.get('/users',  userController.getUser)
app.get('/user/:userId', authMiddelware.verifyToken, authMiddelware.verifyRole('ADMIN'), userController.getUserId)

app.post('/create/category', categoryController.createCategory, authMiddelware.verifyRole('ADMIN'), authMiddelware.verifyToken);
app.get('/categorys', categoryController.getCategorys);
app.delete('/delete/category/:categoryId', categoryController.deleteCategory, authMiddelware.verifyRole('ADMIN'), authMiddelware.verifyToken)
app.put('/update/category/:categoryId', categoryController.updateCategory, authMiddelware.verifyRole('ADMIN'), authMiddelware.verifyToken)

app.post('/create/discount', discountController.createDiscount )
app.get('/discounts', discountController.getDiscounts)
app.get('/discount/:discountId', discountController.getDiscountById)
app.put('/update/discount/:discountId', discountController.updateDiscount)
app.put('/update/status/discount/:discountId', discountController.InactiveDiscount)

app.get('/products', productController.getProducts);
// app.post('/create/product', authMiddelware.verifyToken, authMiddelware.verifyRole('ADMIN'), upload.single('image'), productController.createProduct);
app.post('/create/product',  upload.single('image'), productController.createProduct);
app.post('/apply-discount/product/:productId', productController.applyDiscount);
app.put('/update/product/:productId', productController.updatedProduct)
app.delete('/delete/product/:productId', productController.deleteProduct)

app.post('/create/member', memberController.createMember)
app.get('/members', memberController.getMembers)

app.post('/create/barcode', barcodeController.createBarcode)

app.post('/create/stock/product', reportController.updateStock)
app.get('/report/stock', reportController.getReportStock)
app.post('/create/report/product', reportController.createReportProduct)
app.get('/report/product', reportController.getReportProduct)
app.post('/create/sales/report', reportController.createSalesReport)
app.get("/report/sales", reportController.getReportSales)

app.post('/crate/transaction',authMiddelware.verifyToken, transactionController.createTransaction) 
app.get('/transactions', transactionController.getTransactions)

app.use('/src/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {  
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});