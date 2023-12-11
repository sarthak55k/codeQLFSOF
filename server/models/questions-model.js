const mongoose = require('mongoose');
const questionSchema = require('../schema/questions-schema.js')
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
