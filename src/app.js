const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authController = require('./api/auth/auth-controller');
const userController = require('./api/user/user-controller');
const authMiddelware = require('./middelware/auth-middelware');
const upload = require('./middelware/image-middelware')

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.post('/login', authController.login);

app.post('/create/user', authMiddelware.verifyToken, authMiddelware.verifyRole('admin'), upload.single('profilePic'), userController.createUser);
app.put('/update/user/:userId/role', authMiddelware.verifyToken, authMiddelware.verifyRole('admin'), userController.updateRole);
app.delete('/delete/user/:userId', authMiddelware.verifyToken, authMiddelware.verifyRole('admin'), userController.deleteUser);
app.get('/users',  userController.getUser)
app.get('/user/:userId', authMiddelware.verifyToken, authMiddelware.verifyRole('admin'), userController.getUserId)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});