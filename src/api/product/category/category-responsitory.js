const prisma = require('../../../config/db')

const create = async (categoryData) => {
    return await prisma.category.create({ data: categoryData });
};

const findAll = async () => {
    return await prisma.category.findMany({});
};

module.exports = {
    create,
    findAll
}