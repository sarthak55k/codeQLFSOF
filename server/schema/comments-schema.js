const mongoose = require('mongoose');
const commentsSchema = new mongoose.Schema({
    comment: String,
    comment_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    votes: Number,
    voteUp: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comment_date_time: Date
}, {collection: 'comments'});

module.exports = commentsSchema;