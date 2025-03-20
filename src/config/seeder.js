const prisma = require('./db')
const bcrypt = require('bcrypt');

async function seed() {
  const hashedPassword = await bcrypt.hash('123', 10); 
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      phoneNumber: 1234567890,
      role: 'ADMIN',
    },
  });
  console.log('Admin account created:', admin);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });