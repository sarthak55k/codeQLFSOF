const commentsModel = require('../models/comments-model.js');

const findComments = () => commentsModel.find().sort({ comment_date_time: -1 });
const findCommentByUser = (uid) => commentsModel.find({comment_by : uid}).sort({ comment_date_time: -1 });
const findCommentById = (cid) => commentsModel.findById({_id: cid});
const createComment = (comment) => commentsModel.create(comment);
const deleteComment = (cid) => commentsModel.deleteOne({_id: cid});
const updateComment = (cid, comment) => commentsModel.updateOne({_id: cid}, {$set: comment})
const deleteManyComments = (commentIds) => commentsModel.deleteMany({_id: { $in: commentIds}})

module.exports = {
    findComments,
    findCommentByUser,
    findCommentById,
    createComment,
    deleteComment,
    updateComment,
    deleteManyComments
};