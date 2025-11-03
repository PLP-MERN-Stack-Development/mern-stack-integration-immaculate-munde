# Blog API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Posts Endpoints

### 1. Get All Posts
**GET** `/posts`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category name

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "currentPage": 1,
    "totalPages": 5,
    "totalPosts": 50
  }
}
```

---

### 2. Get Single Post
**GET** `/posts/:idOrSlug`

**Parameters:**
- `idOrSlug`: Post ID or slug

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Post Title",
    "content": "Post content...",
    "author": { "name": "John Doe", "email": "john@example.com" },
    "category": { "name": "Technology" },
    "viewCount": 42,
    ...
  }
}
```

---

### 3. Create Post
**POST** `/posts` 🔒 (Protected)

**Request Body:**
```json
{
  "title": "My Blog Post",
  "content": "This is the content of my blog post...",
  "category": "60d5ec49f1b2c8b1f8e4e1a1",
  "excerpt": "Short description",
  "tags": ["javascript", "nodejs"],
  "featuredImage": "https://example.com/image.jpg",
  "isPublished": true
}
```

**Validation Rules:**
- `title`: Required, 3-100 characters
- `content`: Required, minimum 10 characters
- `category`: Required, valid ObjectId
- `excerpt`: Optional, max 200 characters
- `tags`: Optional, must be array
- `featuredImage`: Optional, must be valid URL
- `isPublished`: Optional, boolean

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": { ... }
}
```

---

### 4. Update Post
**PUT** `/posts/:id` 🔒 (Protected)

**Parameters:**
- `id`: Post ID (must be valid ObjectId)

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "isPublished": true
}
```

**Authorization:** Only the post author can update

**Response:**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": { ... }
}
```

---

### 5. Delete Post
**DELETE** `/posts/:id` 🔒 (Protected)

**Parameters:**
- `id`: Post ID (must be valid ObjectId)

**Authorization:** Only the post author can delete

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### 6. Add Comment to Post
**POST** `/posts/:id/comments` 🔒 (Protected)

**Parameters:**
- `id`: Post ID (must be valid ObjectId)

**Request Body:**
```json
{
  "content": "This is a great post!"
}
```

**Validation Rules:**
- `content`: Required, 1-500 characters

**Response:**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "comments": [...]
  }
}
```

---

### 7. Search Posts
**GET** `/posts/search`

**Query Parameters:**
- `q`: Search query (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "count": 5
  }
}
```

---

## Categories Endpoints

### 1. Get All Categories
**GET** `/categories`

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "...",
        "name": "Technology",
        "description": "Tech-related posts"
      }
    ],
    "count": 5
  }
}
```

---

### 2. Create Category
**POST** `/categories`

**Request Body:**
```json
{
  "name": "Technology",
  "description": "Posts about technology"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters, must be unique
- `description`: Optional, max 200 characters

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "...",
    "name": "Technology",
    "description": "Posts about technology"
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Post not found"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Not authorized to update this post"
}
```

### Duplicate Entry (409)
```json
{
  "success": false,
  "message": "Category already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Models

### Post Model
```javascript
{
  title: String (required, max 100 chars),
  content: String (required),
  featuredImage: String (default: 'default-post.jpg'),
  slug: String (auto-generated, unique),
  excerpt: String (max 200 chars),
  author: ObjectId (ref: User, required),
  category: ObjectId (ref: Category, required),
  tags: [String],
  isPublished: Boolean (default: false),
  viewCount: Number (default: 0),
  comments: [{
    user: ObjectId (ref: User),
    content: String (required),
    createdAt: Date
  }],
  timestamps: true
}
```

### Category Model
```javascript
{
  name: String (required, unique, max 50 chars),
  description: String (max 200 chars),
  timestamps: true
}
```

---

## Features Implemented

✅ **RESTful API Design**
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Meaningful status codes
- Consistent response format

✅ **Input Validation**
- Using express-validator
- Field-level validation rules
- Custom validators for ObjectIds

✅ **Error Handling**
- Centralized error handler middleware
- Mongoose error handling (validation, cast, duplicate)
- JWT error handling
- 404 handler for undefined routes

✅ **Mongoose Models**
- Post and Category models with relationships
- Schema validation
- Pre-save hooks (slug generation)
- Instance methods (addComment, incrementViewCount)

✅ **Additional Features**
- Pagination for posts
- Search functionality
- Category filtering
- Comment system
- View counter
- Author authorization checks
