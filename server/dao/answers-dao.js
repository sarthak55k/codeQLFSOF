const answersModel = require("../models/answers-model.js");
const sanitize = require("mongoose-sanitize");

const findAnswers = () => answersModel.find();
const findAnswerById = (aid) => answersModel.findById({_id: aid});
const createAnswer = (answer) => answersModel.create(answer);
const deleteAnswer = (aid) => answersModel.deleteOne({_id: aid});
const updateAnswer = (aid, answer) => {
    const sanitizedId = sanitize(aid);
    const sanitizedAnswer = sanitize(answer);
    answersModel.updateOne({_id: sanitizedId}, {$set: sanitizedAnswer})
}
const deleteManyAnswers = (answerIds) => answersModel.deleteMany({_id: { $in: answerIds}})


module.exports = {
    findAnswers,
    findAnswerById,
    createAnswer,
    deleteAnswer,
    updateAnswer,
    deleteManyAnswers
};