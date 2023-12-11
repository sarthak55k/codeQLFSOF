const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: String,
    ans_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ans_date_time: Date,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    votes: Number,
    voteUp: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    voteDown: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {collection: 'answers'});

module.exports = answerSchema;