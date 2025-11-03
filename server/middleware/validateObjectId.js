// server/middleware/validateObjectId.js
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  const id = req.params.id || req.params.postId;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  next();
};
