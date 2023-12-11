const mongoose = require('mongoose');
const userSchema = require('../schema/users-schema.js')
const User = mongoose.model('User', userSchema);

module.exports = User;