const mongoose = require('mongoose');
const tagsSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    tag_added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {collection: 'tags'});

module.exports = tagsSchema;