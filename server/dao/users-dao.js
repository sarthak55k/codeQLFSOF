const usersModel = require('../models/users-model.js');
const questionsModel = require("../models/questions-model.js");
const answerModel = require("../models/answers-model.js");
const tagModel = require("../models/tags-model.js")

const findUsers = () => usersModel.find();
const findUserById = (uid) => usersModel.findById({_id: uid});
const findUserByUsername = (username) => usersModel.find({username: username})
const findUserByEmail = (email) => usersModel.find({email: email})
const createUser = (user) => usersModel.create(user);
const updateUser = (uid, user) => usersModel.updateOne({_id: uid}, {$set: user})
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