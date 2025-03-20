const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authController = require('./api/auth/auth-controller');
const userController = require('./api/user/user-controller');
const authMiddelware = require('./middelware/auth-middelware');
const categoryController = require('./api/product/category/category-controller');
const upload = require('./middelware/image-middelware')

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.post('/login', authController.login);

app.post('/create/user', authMiddelware.verifyToken, authMiddelware.verifyRole('ADMIN'), upload.single('profilePic'), userController.createUser);
app.put('/update/role/:userId', authMiddelware.verifyToken, authMiddelware.verifyRole('ADMIN'), userController.updateRole);
app.delete('/delete/user/:userId', authMiddelware.verifyToken, authMiddelware.verifyRole('ADMIN'), userController.deleteUser);
app.get('/users',  userController.getUser)
app.get('/user/:userId', authMiddelware.verifyToken, authMiddelware.verifyRole('ADMIN'), userController.getUserId)

app.post('/create/category', categoryController.createCategory, authMiddelware.verifyRole, authMiddelware.verifyToken);
app.get('/categorys', categoryController.getCategorys);

app.get('/', (req, res) => {  
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});