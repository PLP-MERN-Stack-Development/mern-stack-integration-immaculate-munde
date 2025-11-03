const express = require('express');
const router = express.Router();

// Sample login route
router.post('/login', (req, res) => {
  res.json({ message: 'Login route working!' });
});

// Sample register route
router.post('/register', (req, res) => {
  res.json({ message: 'Register route working!' });
});

module.exports = router;
