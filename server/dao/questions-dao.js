const questionsModel = require("../models/questions-model.js");
const usersModel = require("../models/users-model.js")
const answerModel = require("../models/answers-model.js");
const tagModel = require("../models/tags-model.js")
const commentModel = require("../models/comments-model.js")


const findQuestions = () => questionsModel.find().populate({
    path: 'tags',
    select: 'name',
})
    .populate({
        path: 'asked_by',
        select: 'username _id',
    })
    .exec();
const findQuestionById = (qid) => questionsModel.findById({_id: qid});
const createQuestion = (question) => questionsModel.create(question);
const deleteQuestion = (qid) => questionsModel.deleteOne({_id: qid});
const updateQuestion = (qid, question) => questionsModel.updateOne({_id: qid}, {$set: question})
const newestQuestions = () => questionsModel.find({}).sort({ ask_date_time: -1 }).exec();
const unansweredQuestions = () => questionsModel.find({ answers: [] }).exec();
// const findQuestionByTagId = (tid) => questionsModel.find({ "tags": tid });

const findQuestionByTagId = (tagIds) => {
    return questionsModel.find({ "tags": { $in: tagIds } })
        .populate({
            path: 'tags',
            select: 'name', // Include only the 'name' field from the referenced Tag model
        })
        .populate({
            path: 'asked_by',
            select: 'username _id', // Include both 'username' and '_id' from the referenced User model
        })
        .exec();
};
const findQuestionBySearchParams = (searchParam) => questionsModel.find({
    $or: [
            {
                text: {
                    $regex: searchParam,
                    $options: 'i'
                }
            },
            {
                title: {
                    $regex: searchParam,
                    $options: 'i'
                }
            }
        ]
    }).populate({
        path: 'tags',
        select: 'name', // Include only the 'name' field from the referenced Tag model
    }).populate({
        path: 'asked_by',
        select: 'username _id', // Include both 'username' and '_id' from the referenced User model
    }).exec();

async function getAllQuestionsWithUsernames() {
    try {
        return await questionsModel.find()
            .populate({
                path: 'asked_by',
                model: usersModel,
                select: 'username', // Only retrieve the username field
            })
            .exec();
    } catch (error) {
        console.error('Error retrieving questions:', error);
        throw error;
    }
}

async function getQuestionByIdWithUsernames(qid) {
    try {
        return await questionsModel.findById({_id: qid})
            .populate({
                path: 'asked_by',
                model: usersModel,
                select: 'username', // Only retrieve the username field
            })
            .exec();
    } catch (error) {
        console.error('Error retrieving questions:', error);
        throw error;
    }
}

async function getQuestionDetailsById(questionId) {
    try {
        const question = await questionsModel.findById(questionId)
            .populate({
                path: 'comments',
                model: commentModel,
                options: { sort: { comment_date_time: -1 } }, // Sort comments in descending order
                populate: {
                    path: 'comment_by',
                    model: 'User'
                }
            })
            .populate({
                path: 'answers',
                model: answerModel,
                options: { sort: { ans_date_time: -1 } }, // Sort answers in descending order
                populate: [
                    {
                        path: 'ans_by',
                        model: usersModel
                    },
                    {
                        path: 'comments',
                        model: commentModel,
                        options: { sort: { comment_date_time: -1 } }, // Sort answer comments in descending order
                        populate: {
                            path: 'comment_by',
                            model: usersModel
                        }
                    }
                ]
            })
            .populate([
                {
                    path: 'tags',
                    model: tagModel,
                    select: 'name tag_added_by'
                },
                {
                    path: 'asked_by',
                    model: usersModel,
                    select: 'username email reputation registration_date_time'
                }
            ]);

        return question;
    } catch (error) {
        console.error('Error fetching question details:', error);
        throw error;
    }
}

const findTagCount = (tId) => questionsModel.find({ tags: { $in: [tId] } }).then((results) => {
    return results;
});

const findQuestionIdByAnswerId = (aid) => questionsModel.findOne({ answers: { $in: [aid] } }, '_id')
    .then((question) => {
        if (question) {
            return question._id;
        }
    })
    .catch((err) => {
        console.error(err);
    });

const findQuestionIdByCommentId = (cid) => questionsModel.findOne({comments: { $in: [cid] } }, '_id')
    .then((question) => {
        if (question) {
            return question._id;
        }
    })
    .catch((err) => {
        console.log(err)
    })

const deleteTagFromQuestions = async (tagId) => {
    try {
        const result = await questionsModel.updateMany(
            { tags: tagId },
            { $pull: { tags: tagId } }
        );
        return result;
    } catch (error) {
        console.error('Error deleting tag from questions:', error);
    }
};

module.exports = {
    findQuestions,
    findQuestionById,
    createQuestion,
    deleteQuestion,
    updateQuestion,
    newestQuestions,
    unansweredQuestions,
    findQuestionByTagId,
    findQuestionBySearchParams,
    getAllQuestionsWithUsernames,
    getQuestionByIdWithUsernames,
    getQuestionDetailsById,
    findTagCount,
    findQuestionIdByAnswerId,
    findQuestionIdByCommentId,
    deleteTagFromQuestions
};