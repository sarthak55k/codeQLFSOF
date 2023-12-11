const usersModel = require('../models/users-model.js');
const questionsModel = require("../models/questions-model.js");
const answerModel = require("../models/answers-model.js");
const tagModel = require("../models/tags-model.js")
const sanitize = require('mongoose-sanitize');

const findUsers = () => usersModel.find();
const findUserById = (uid) => usersModel.findById({_id: uid});
const findUserByUsername = (username) => {
    const sanitizedUsername = sanitize(username);
    usersModel.find({username: sanitizedUsername})
}
const findUserByEmail = (email) => {
    const sanitizedEmail = sanitize(email);
    usersModel.find({email: sanitizedEmail})
}
const createUser = (user) => usersModel.create(user);
const updateUser = (uid, user) => {
    const sanitizedId = sanitize(uid);
    const sanitizedUser = sanitize(user);
    usersModel.updateOne({_id: sanitizedId}, {$set: sanitizedUser})
}
const deleteUser = (uid) => usersModel.deleteOne({_id: uid});
const questionsByUsers = (uid) => questionsModel.find({ asked_by: uid });
const answersByUsers = (uid) => answerModel.find({ ans_by: uid }).sort({ ans_date_time: -1 });
const tagByUsers = (uid) => tagModel.find({ tag_added_by: uid }).sort({comment_date_time: -1});


module.exports = {
    findUsers,
    findUserById,
    findUserByUsername,
    findUserByEmail,
    createUser,
    deleteUser,
    updateUser,
    questionsByUsers,
    answersByUsers,
    tagByUsers
};