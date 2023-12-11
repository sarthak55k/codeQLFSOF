const answerDao = require("../dao/answers-dao.js");
const questionDao = require("../dao/questions-dao.js")
const commentDao = require("../dao/comments-dao.js")
const ResponseClass = require('../service/response-service.js')
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
});

const findAnswers  = async (req, res) => {
    const answers = await answerDao.findAnswers();
    res.json(new ResponseClass(200, answers));
}

const findAnswerById  = async (req, res) => {
    const aid = req.params.aid;
    const answer = await answerDao.findAnswerById(aid);
    res.json(new ResponseClass(200, answer));
}

const saveAnswer = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (currentUser) {
        let newAnswer = req.body;
        const createAnswer = await answerDao.createAnswer(newAnswer);
        // activating an answer handled on the questions-controller when the addAnswerIdToQuestion api is hit
        res.json(new ResponseClass(200, createAnswer));
    } else {
        res.json(new ResponseClass(401, "Login to post questions"));
    }
}

const updateAnswer = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (currentUser) {
        const answerIdToUpdate = req.params.aid;
        const answerBody = req.body;
        const status = await answerDao
            .updateAnswer(answerIdToUpdate,
                answerBody);
        await updateLastActive(answerIdToUpdate);
        res.json(new ResponseClass(200, status));
    } else {
        res.json(new ResponseClass(401, "Login to post questions"));
    }
}

const deleteAnswer = async (req, res) => {
    const currentUser = req.session["currentUser"];
    try {
        if (currentUser) {
            const answerIdToDelete = req.params.aid;
            const questionId = await questionDao.findQuestionIdByAnswerId(answerIdToDelete);
            const question = await questionDao.findQuestionById(questionId);
            if (question) {
                let indexToRemove = question.answers.indexOf(answerIdToDelete);
                if (indexToRemove !== -1) {
                    question.answers.splice(indexToRemove, 1);
                }
            }
            question.last_active = new Date().toISOString();
            await questionDao.updateQuestion(questionId, question);
            const answer = await answerDao.findAnswerById(answerIdToDelete);
            if (answer) {
                const commentIds = answer.comments;
                await commentDao.deleteManyComments(commentIds);
                const status = await answerDao
                    .deleteAnswer(answerIdToDelete);
                res.json(new ResponseClass(200, status));
            }
        } else {
            res.json(new ResponseClass(401, "User not logged in"));
        }
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const getAnswersByQuestionId = async (req, res) => {
    try {
        const qid = req.params.qid;
        const question = await questionDao.findQuestionById(qid);
        const answers = []
        const answersId = question.answers
        for (let aid in answersId) {
            const answer = await answerDao.findAnswerById(answersId[aid]);
            answers.push(answer);
        }
        res.json(new ResponseClass(200,await sortAnswers(answers)));
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const sortAnswers = async (answers) => {
    answers.sort((a, b) => {
        const keyA = new Date(a.ans_date_time),
            keyB = new Date(b.ans_date_time);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
    });
    return answers;
}

const voteUp = async (req, res) => {
    try {
        const currentUser = req.session["currentUser"];

        if (currentUser) {
            const aid = req.params.aid;
            const answer = await answerDao.findAnswerById(aid);
            if (!answer.voteUp.includes(currentUser._id)) {
                answer.votes += 1;
                answer.voteUp.push(currentUser._id)
                const status = await answerDao
                    .updateAnswer(aid,
                        answer);
                await updateLastActive(aid);
                res.json(new ResponseClass(200, status));
            } else {
                res.json(new ResponseClass(409, "Current user already upvoted this answer"));
            }
        } else {
            res.json(new ResponseClass(401, "Login to upvote answer"));
        }
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const voteDown = async (req, res) => {
    try {
        const currentUser = req.session["currentUser"];

        if (currentUser) {
            const aid = req.params.aid;
            const answer = await answerDao.findAnswerById(aid);
            if (!answer.voteDown.includes(currentUser._id)) {
                answer.votes -= 1;
                answer.voteDown.push(currentUser._id)
                const status = await answerDao
                    .updateAnswer(aid,
                        answer);
                await updateLastActive(aid);
                res.json(new ResponseClass(200, status));
            } else {
                res.json(new ResponseClass(409, "Current user already downvoted this answer"));
            }
        } else {
            res.json(new ResponseClass(401, "Login to downvote answer"));
        }
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const addComment = async (req, res) => {
    try {
        const cid = req.params.cid;
        const aid = req.params.aid;
        const answer = await answerDao.findAnswerById(aid);
        answer.comments.push(cid);
        const status = await answerDao
            .updateAnswer(aid,
                answer);
        res.json(new ResponseClass(200, status));
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const updateLastActive = async (aId) => {
    const qId = await questionDao.findQuestionIdByAnswerId(aId);
    const question = await questionDao.findQuestionById(qId);
    question.last_active = new Date().toISOString();
    await questionDao.updateQuestion(qId, question);
}

module.exports = (app) => {
    app.use('/api/answer/allAnswers', limiter);
    app.use('/api/answer/:aid', limiter);
    app.use('/api/answer/voteUp/:aid', limiter);
    app.use('/api/answer/voteDown/:aid', limiter);
    app.use('/api/answer/getAnswersByQuestionId/:qid', limiter);
    app.use('/api/answer/saveAnswer', limiter);
    app.use('/api/answer/updateAnswer/:aid', limiter);
    app.use('/api/answer/deleteAnswer/:aid', limiter);
    app.use('/api/answer/addComment/:aid/:cid', limiter);

    app.get('/api/answer/allAnswers', findAnswers);
    app.get('/api/answer/:aid', findAnswerById);
    app.get('/api/answer/voteUp/:aid', voteUp);
    app.get('/api/answer/voteDown/:aid', voteDown);
    app.get('/api/answer/getAnswersByQuestionId/:qid', getAnswersByQuestionId);
    app.post('/api/answer/saveAnswer', saveAnswer);
    app.put('/api/answer/updateAnswer/:aid', updateAnswer);
    app.delete('/api/answer/deleteAnswer/:aid', deleteAnswer);
    app.get('/api/answer/addComment/:aid/:cid', addComment);
};