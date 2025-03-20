const categoryRepository = require('./category-responsitory');

const createCategory = async (categoryData) => {
    return await categoryRepository.create(categoryData);
};

const getCategories = async () => {
    return await categoryRepository.findAll();
};

module.exports = {
    createCategory,
    getCategories
}