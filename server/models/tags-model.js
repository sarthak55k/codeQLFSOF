const mongoose = require('mongoose');
const tagSchema = require('../schema/tags-schema.js')
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
