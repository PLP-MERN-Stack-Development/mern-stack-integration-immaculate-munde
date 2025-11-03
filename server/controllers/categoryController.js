// server/controllers/categoryController.js
const Category = require('../models/Category');

// GET /api/categories - Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: {
        categories,
        count: categories.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/categories - Create a new category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    // Check if category already exists
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(409).json({ 
        success: false,
        message: 'Category already exists' 
      });
    }

    const category = await Category.create({ name, description });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (err) {
    next(err);
  }
};
