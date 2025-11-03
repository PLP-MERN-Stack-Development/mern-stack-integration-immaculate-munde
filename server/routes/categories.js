// server/routes/categories.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/validators');

// GET /api/categories - Get all categories
router.get('/', categoryController.getCategories);

// POST /api/categories - Create a new category
router.post('/', validateCategory, categoryController.createCategory);

module.exports = router;
