const { ca } = require('date-fns/locale');
const categoryService = require('./category-service')

const   createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const category = await categoryService.createCategory(categoryData);
        res.status(201).json({
            message: "Category created",
            data: category
        });
    } catch (error) {    
        res.status(401).json({message: error.message})
    }
}

const getCategorys = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.status(200).json({
            message: "Categories found",
            data: categories
        });
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

const deleteCategory = async (req, res) => {
    const {categoryId} = req.params
    try {
        const category = await categoryService.deleteCategory(categoryId);
        res.status(200).json({
            message : "deleted Category",
            data: category
        });
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

const updateCategory = async (req, res) => {
    const {categoryId} = req.params
    const categoryData = req.body;
    try {
        const category = await categoryService.editCategory(categoryId, categoryData);
        res.status(200).json({
            message : "Category updated",
            data: category
        })
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

module.exports = {
    createCategory,
    getCategorys,
    deleteCategory,
    updateCategory
}