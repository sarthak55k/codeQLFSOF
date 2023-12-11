const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {type:String,required:true,unique:true},
    email: {type:String,required:true,unique:true},
    password:{type:String,required:true},
    reputation: Number,
    registration_date_time: Date
}, {collection: 'users'});

module.exports = usersSchema;