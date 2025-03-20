const categoryService = require('./category-service')

const createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const category = await categoryService.createCategory(categoryData);
        res.status(201).json(category);
    } catch (error) {    
        res.status(401).json({message: error.message})
    }
}

const getCategorys = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

module.exports = {
    createCategory,
    getCategorys
}