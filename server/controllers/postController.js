// controllers/postController.js
const Post = require('../models/Post');
const Category = require('../models/Category');

// ✅ GET /api/posts - Get all posts (with pagination and optional category)
exports.getAllPosts = async (req, res, next) => {
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
      success: true,
      data: {
        posts,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ GET /api/posts/:idOrSlug - Get a single post
exports.getPost = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const post = await Post.findOne({
      $or: [{ _id: idOrSlug }, { slug: idOrSlug }],
    })
      .populate('author', 'name email')
      .populate('category', 'name')
      .populate('comments.user', 'name email');

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
      });
    }

    // Increment view count
    await post.incrementViewCount();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ POST /api/posts - Create a new post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags, excerpt, featuredImage, isPublished } = req.body;

    const newPost = await Post.create({
      title,
      content,
      category,
      tags,
      excerpt,
      featuredImage,
      isPublished,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'name email')
      .populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ PUT /api/posts/:id - Update a post
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
      });
    }

    // Optional: check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this post' 
      });
    }

    Object.assign(post, req.body);
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name email')
      .populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ DELETE /api/posts/:id - Delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
      });
    }

    // Optional: check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this post' 
      });
    }

    await post.deleteOne();

    res.status(200).json({ 
      success: true,
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
};

// ✅ POST /api/posts/:id/comments - Add comment to a post
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
      });
    }

    const { content } = req.body;
    await post.addComment(req.user._id, content);

    res.status(200).json({ 
      success: true,
      message: 'Comment added successfully', 
      data: { comments: post.comments }
    });
  } catch (error) {
    next(error);
  }
};

// ✅ GET /api/posts/search?q=keyword - Search posts
exports.searchPosts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ 
        success: false,
        message: 'Search query is required' 
      });
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ],
    })
      .populate('author', 'name')
      .populate('category', 'name');

    res.status(200).json({
      success: true,
      data: {
        posts,
        count: posts.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
