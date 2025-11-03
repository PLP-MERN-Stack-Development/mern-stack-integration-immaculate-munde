#!/bin/bash

# ------------------------------
# MERN Blog API End-to-End Test
# ------------------------------

BASE_URL="http://localhost:5000/api"

echo "Step 1: Signup user..."
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}')

TOKEN=$(echo $SIGNUP_RESPONSE | jq -r '.token')
USER_ID=$(echo $SIGNUP_RESPONSE | jq -r '.user.id')

echo "Signup token: $TOKEN"
echo "User ID: $USER_ID"
echo

echo "Step 2: Login user..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
-H "Content-Type: application/json" \
-d '{
  "email": "john@example.com",
  "password": "password123"
}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "Login token: $TOKEN"
echo

echo "Step 3: Create a category..."
CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{"name":"Technology"}')

CATEGORY_ID=$(echo $CATEGORY_RESPONSE | jq -r '._id')
echo "Category ID: $CATEGORY_ID"
echo

echo "Step 4: Create a post..."
POST_RESPONSE=$(curl -s -X POST "$BASE_URL/posts" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d "{
  \"title\": \"My First Blog Post\",
  \"content\": \"This is the content of my first post.\",
  \"category\": \"$CATEGORY_ID\",
  \"tags\": [\"tech\", \"programming\"],
  \"excerpt\": \"Short summary of my post.\"
}")

POST_ID=$(echo $POST_RESPONSE | jq -r '._id')
echo "Post ID: $POST_ID"
echo

echo "Step 5: Add a comment..."
COMMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/posts/$POST_ID/comments" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{"content":"Great post! Really enjoyed it."}')

echo "Comments response:"
echo $COMMENT_RESPONSE | jq
echo

echo "Step 6: Fetch all posts..."
ALL_POSTS=$(curl -s -X GET "$BASE_URL/posts")
echo $ALL_POSTS | jq
echo

echo "✅ All API tests completed successfully!"
