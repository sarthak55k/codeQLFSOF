const mongoose = require('mongoose');
const answerSchema = require('../schema/answers-schema.js')
const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
