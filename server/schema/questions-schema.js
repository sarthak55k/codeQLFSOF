const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: String,
    text: String,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
    pinned_answer: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Answer',
        default: ''
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    asked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ask_date_time: Date,
    views: Number,
    votes: Number,
    voteUp: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    voteDown: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    last_active: Date
}, {collection: 'questions'});

module.exports = questionSchema;