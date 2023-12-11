const mongoose = require('mongoose');
const commentSchema = require('../schema/comments-schema.js')
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;