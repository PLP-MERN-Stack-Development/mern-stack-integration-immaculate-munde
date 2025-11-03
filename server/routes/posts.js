// routes/posts.js
const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  searchPosts,
} = require('../controllers/postController');

// Import authentication middleware (optional for protected routes)
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPosts);
router.get('/search', searchPosts);
router.get('/:idOrSlug', getPost);

// Protected routes (require login)
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
