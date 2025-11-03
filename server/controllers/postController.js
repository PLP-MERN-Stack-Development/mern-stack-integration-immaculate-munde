// controllers/postController.js
const Post = require('../models/Post');
const Category = require('../models/Category');

// ✅ GET /api/posts - Get all posts (with pagination and optional category)
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const filter = {};

    if (category) {
      const categoryObj = await Category.findOne({ name: category });
      if (categoryObj) filter.category = categoryObj._id;
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      posts,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET /api/posts/:idOrSlug - Get a single post
exports.getPost = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const post = await Post.findOne({
      $or: [{ _id: idOrSlug }, { slug: idOrSlug }],
    })
      .populate('author', 'name email')
      .populate('category', 'name')
      .populate('comments.user', 'name email');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Increment view count
    await post.incrementViewCount();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ POST /api/posts - Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, tags, excerpt, featuredImage } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newPost = await Post.create({
      title,
      content,
      category,
      tags,
      excerpt,
      featuredImage,
      author: req.user._id,
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ PUT /api/posts/:id - Update a post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Optional: check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    Object.assign(post, req.body);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE /api/posts/:id - Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Optional: check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ POST /api/posts/:id/comments - Add comment to a post
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment content is required' });

    await post.addComment(req.user._id, content);

    res.status(200).json({ message: 'Comment added successfully', comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET /api/posts/search?q=keyword - Search posts
exports.searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query is required' });

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ],
    })
      .populate('author', 'name')
      .populate('category', 'name');

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
