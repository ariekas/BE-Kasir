const prisma = require("../../config/db");

const create = async (userData) => {
  return await prisma.user.create({ data: userData });
};

const findAll = async () => {
    return await prisma.user.findMany({});
}

const findById = async (userId) => {
    return await prisma.user.findUnique({
        where:{id: userId}
    })
}

const update = async (userId, role) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
};

const disable = async (userId) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};

module.exports = {
  create,
  update,
  disable,
  findAll,
  findById
};