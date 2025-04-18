const categoryRepository = require('./category-responsitory');

const createCategory = async (categoryData) => {
    return await categoryRepository.create(categoryData);
};

const getCategories = async () => {
    return await categoryRepository.findAll();
};

const deleteCategory = async (categoryId) => {
    return await categoryRepository.disable(categoryId);
}

const editCategory = async (categoryId, categoryData) => {
    return await categoryRepository.update(categoryId, categoryData);
}

module.exports = {
    createCategory,
    getCategories,
    deleteCategory,
    editCategory
}