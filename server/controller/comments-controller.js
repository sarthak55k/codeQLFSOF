const commentDao = require('../dao/comments-dao.js')
const ResponseClass = require('../service/response-service.js')
const answerDao = require("../dao/answers-dao");
const questionDao = require("../dao/questions-dao");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
});

const findComments  = async (req, res) => {
    const tags = await commentDao.findComments();
    res.json(tags);
}

const createComment = async(req, res) => {
    try {
        const commentBody = req.body;
        const response = await commentDao.createComment(commentBody);
        res.json(new ResponseClass(200, response));
    } catch(error) {
        res.json(new ResponseClass(500, "Internal server error"));
    }
}

const findCommentsByUserId = async(req, res) => {
    try {
        const userId = req.params.uid;
        const comments = await commentDao.findCommentByUser(userId);
        res.json(new ResponseClass(200, comments));
    } catch (error) {
        res.json(new ResponseClass(500, "Internal server error"));
    }
}

const findCommentsById = async(req, res) => {
    try {
        const cid = req.params.cid;
        const comments = await commentDao.findCommentById(cid);
        res.json(new ResponseClass(200, comments));
    } catch (error) {
        res.json(new ResponseClass(500, "Internal server error"));
    }
}

const voteUp = async (req, res) => {
    try {
        const currentUser = req.session["currentUser"];

        if (currentUser) {
            const cid = req.params.cid;
            const comment = await commentDao.findCommentById(cid);
            if (!comment.voteUp.includes(currentUser._id)) {
                comment.votes += 1;
                comment.voteUp.push(currentUser._id);
                const status = await commentDao.updateComment(cid,
                    comment);
                await updateLastActive(cid);
                res.json(new ResponseClass(200, status));
            } else {
                res.json(new ResponseClass(409, "Current user already upvoted this comment"));
            }
        } else {
            res.json(new ResponseClass(401, "Login to upvote comment"));
        }
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const deleteCommentByIdFromQuestion = async (req, res) => {
    const currentUser = req.session["currentUser"];
    try {
        if (currentUser) {
            const commentIdToDelete = req.params.cid;
            const questionId = req.params.qid;
            const question = await questionDao.findQuestionById(questionId);
            if (question) {
                let indexToRemove = question.comments.indexOf(commentIdToDelete);
                if (indexToRemove !== -1) {
                    question.comments.splice(indexToRemove, 1);
                }
            }
            question.last_active = new Date().toISOString();
            await questionDao.updateQuestion(questionId, question);
            const status = await commentDao
                .deleteComment(commentIdToDelete);
            res.json(new ResponseClass(200, status));
        } else {
            res.json(new ResponseClass(403, "User not logged in"));
        }
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const deleteCommentByIdFromAnswer = async (req, res) => {
    const currentUser = req.session["currentUser"];
    try {
        if (currentUser) {
            const commentIdToDelete = req.params.cid;
            const answerId = req.params.aid;
            const answer = await answerDao.findAnswerById(answerId);
            if (answer) {
                let indexToRemove = answer.comments.indexOf(commentIdToDelete);
                if (indexToRemove !== -1) {
                    answer.comments.splice(indexToRemove, 1);
                }
            }
            await answerDao.updateAnswer(answerId, answer);
            const status = await commentDao
                .deleteComment(commentIdToDelete);
            res.json(new ResponseClass(200, status));
        } else {
            res.json(new ResponseClass(403, "User not logged in"));
        }
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const updateLastActive = async (cId) => {
    const qId = await questionDao.findQuestionIdByCommentId(cId);
    const question = await questionDao.findQuestionById(qId);
    question.last_active = new Date().toISOString();
    await questionDao.updateQuestion(qId, question);
}

module.exports = (app) => {
    app.use('/api/comment/allComments', limiter);
    app.use('/api/comment/createComment', limiter);
    app.use('/api/comment/getComments/:uid', limiter);
    app.use('/api/comment/getCommentsById/:cid', limiter);
    app.use('/api/comment/upvote/:cid', limiter);
    app.use('/api/comment/deleteCommentFromQuestion/:cid/:qid', limiter)
    app.use('/api/comment/deleteCommentFromAnswer/:cid/:aid', limiter)

    app.get('/api/comment/allComments', findComments);
    app.post('/api/comment/createComment', createComment);
    app.get('/api/comment/getComments/:uid', findCommentsByUserId);
    app.get('/api/comment/getCommentsById/:cid', findCommentsById);
    app.get('/api/comment/upvote/:cid', voteUp);
    app.delete('/api/comment/deleteCommentFromQuestion/:cid/:qid', deleteCommentByIdFromQuestion)
    app.delete('/api/comment/deleteCommentFromAnswer/:cid/:aid', deleteCommentByIdFromAnswer)
};
