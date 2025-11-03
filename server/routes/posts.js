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

// Import validation middleware
const {
  validatePost,
  validatePostUpdate,
  validateComment,
  validateObjectId,
} = require('../middleware/validators');

// Public routes
router.get('/', getAllPosts);
router.get('/search', searchPosts);
router.get('/:idOrSlug', getPost);

// Protected routes (require login)
router.post('/', protect, validatePost, createPost);
router.put('/:id', protect, validateObjectId, validatePostUpdate, updatePost);
router.delete('/:id', protect, validateObjectId, deletePost);
router.post('/:id/comments', protect, validateObjectId, validateComment, addComment);

module.exports = router;
