const questionDao = require("../dao/questions-dao.js");
const tagDao = require("../dao/tags-dao.js")
const sortService = require("../service/question-sort-service");
const ResponseClass = require('../service/response-service.js');
const answerDao = require('../dao/answers-dao.js')
const commentDao = require('../dao/comments-dao.js')

const findQuestions  = async (req, res) => {
    const sortType = req.params.sortType;
    const questions = await questionDao.findQuestions();

    const sortClass = await sortService.createSorter(sortType);
    const sortedQuestions = await sortClass.sort(questions);
    res.json(new ResponseClass(200, sortedQuestions));
}

const findQuestionById  = async (req, res) => {
    const qid = req.params.qid;
    const question = await questionDao.findQuestionById(qid);
    res.json(new ResponseClass(200, question));
}

const saveQuestion = async (req, res) => {
    const currentUser = req.session["currentUser"];

    if (currentUser) {
        let newQuestion = req.body;
        let tagParams = newQuestion.tags;
        const tagIds = []
        for (const t in tagParams) {
            const tag = {
                name: tagParams[t],
                tag_added_by: req.session['currentUser']._id
            }
            const createdTagId = await tagDao.tagCreate(tag);
            if (createdTagId !== '') {
                    tagIds.push(createdTagId);
            }
        }
        newQuestion.tags = tagIds;
        const questionId = await questionDao.createQuestion(newQuestion);
        res.json(new ResponseClass(200, questionId));
    } else {
        res.json(new ResponseClass(401, "Login to post questions"));
    }
}

const updateQuestion = async (req, res) => {
    const currentUser = req.session["currentUser"];
    try {
        if (currentUser) {
            const questionIdToUpdate = req.params.qid;
            const questionToUpdate = await questionDao.findQuestionById(questionIdToUpdate);
            const questionBody = req.body;
            questionToUpdate.title = questionBody.title;
            questionToUpdate.text = questionBody.text;
            let tagParams = questionBody.tags;
            const tagIds = []
            for (const t in tagParams) {
                const tag = {
                    name: tagParams[t],
                    tag_added_by: req.session['currentUser']._id
                }
                const createdTagId = await tagDao.tagCreate(tag);
                if (createdTagId !== '') {
                    tagIds.push(createdTagId);
                }
            }
            questionToUpdate.tags = tagIds;
            questionToUpdate.last_active = new Date().toISOString();
            const updatedQuestion = await questionDao.updateQuestion(questionIdToUpdate, questionToUpdate);
            res.json(new ResponseClass(200, updatedQuestion));
        } else {
            res.json(new ResponseClass(401, "Login to update questions"));
        }
    } catch(error) {
        res.json(new ResponseClass(500, "Internal server error"));
    }
}

const updateQuestionView = async (req, res) => {
    const questionIdToUpdate = req.params.qid;
    const question = await questionDao.findQuestionById(questionIdToUpdate);
    if(!question.views) {
        question.views = 1;
    } else {
        question.views += 1;
    }
    const status = await questionDao
        .updateQuestion(questionIdToUpdate,
            question);
    res.json(new ResponseClass(200, status));
}

const addAnswerIdToQuestion = async (req, res) => {
    const questionId = req.params.qid;
    const question = await questionDao.findQuestionById(questionId);
    const answerId = req.params.aid;
    const answer = await answerDao.findAnswerById(answerId);
    question.answers.push(answerId);
    question.last_active = answer.ans_date_time;
    const status = await questionDao
        .updateQuestion(questionId,
            question);
    res.json(new ResponseClass(200, status));
}

const deleteQuestion = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (currentUser) {
        const questionIdToDelete = req.params.qid;
        const question = await questionDao.findQuestionById(questionIdToDelete);
        const answers = question.answers;
        const comments = question.comments;
        await commentDao.deleteManyComments(comments);
        for (let aId in answers) {
            let answer = await answerDao.findAnswerById(answers[aId]);
            if(answer) {
                let comments = answer.comments;
                await commentDao.deleteManyComments(comments);
            }
        }
        await answerDao.deleteManyAnswers(answers);
        const status = await questionDao
            .deleteQuestion(questionIdToDelete);
        res.json(new ResponseClass(200, status));
    } else {
        res.json(new ResponseClass(401, "User not logged in"));
    }
}

const voteUp = async (req, res) => {
    try {
        const currentUser = req.session["currentUser"];

        if (currentUser) {
            const qid = req.params.qid;
            const question = await questionDao.findQuestionById(qid);
            if (!question.voteUp.includes(currentUser._id)) {
                question.votes += 1;
                question.voteUp.push(currentUser._id);
                question.last_active = new Date().toISOString();
                const status = await questionDao
                    .updateQuestion(qid,
                        question);
                res.json(new ResponseClass(200, status));
            } else {
                res.json(new ResponseClass(409, "Current user already upvoted this question"));
            }
        } else {
            res.json(new ResponseClass(401, "Login to upvote question"));
        }
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const voteDown = async (req, res) => {
    try {
        const currentUser = req.session["currentUser"];

        if (currentUser) {
            const qid = req.params.qid;
            const question = await questionDao.findQuestionById(qid);
            if (!question.voteDown.includes(currentUser._id)) {
                question.votes -= 1;
                question.voteDown.push(currentUser._id);
                question.last_active = new Date().toISOString();
                const status = await questionDao
                    .updateQuestion(qid,
                        question);
                res.json(new ResponseClass(200, status));
            } else {
                res.json(new ResponseClass(409, "Current user already downvoted this question"));
            }
        } else {
            res.json(new ResponseClass(401, "Login to downvote question"));
        }
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const addCommentIdToQuestion = async (req, res) => {
    try {
        const cid = req.params.cid;
        const qid = req.params.qid;
        const question = await questionDao.findQuestionById(qid);
        question.comments.push(cid);
        question.last_active = new Date().toISOString();
        const status = await questionDao
            .updateQuestion(qid,
                question);
        res.json(new ResponseClass(200, status));
    } catch (error) {
        res.json(new ResponseClass(500, "Internal Server Error"));
    }
}

const getQuestionDetailsById = async (req, res) => {
    try {
        const qid = req.params.qid;
        const questionDetails = await questionDao.getQuestionDetailsById(qid);
        res.json(new ResponseClass(200, questionDetails))
    } catch(error) {
        res.json(new ResponseClass(500, "Internal Server Error"))
    }
}

const pinAnAnswer = async (req, res) => {
    try {
        const currentUser = req.session["currentUser"];
        if (currentUser) {
            const qid = req.params.qid;
            const aid = req.params.aid;

            const question = await questionDao.findQuestionById(qid);
            if (question.answers.includes(aid)) {
                question.pinned_answer = aid;
                question.last_active = new Date().toISOString()
                const response = await questionDao.updateQuestion(qid, question);
                res.json(new ResponseClass(200, response))
            } else {
                res.json(new ResponseClass(409, "answer not in the list"))
            }
        } else {
            res.json(new ResponseClass(401, "User not logged in"))
        }
    } catch(error) {
        res.json(new ResponseClass(500, "Internal Server Error"))
    }
}

module.exports = (app) => {
    app.get('/api/question/allQuestions/:sortType', findQuestions);
    app.get('/api/question/:qid', findQuestionById);
    app.get('/api/question/voteUp/:qid', voteUp);
    app.get('/api/question/voteDown/:qid', voteDown);
    app.get('/api/question/addComment/:qid/:cid', addCommentIdToQuestion);
    app.post('/api/question/addAnswerId/:aid/:qid', addAnswerIdToQuestion);
    app.post('/api/question/saveQuestion', saveQuestion);
    app.put('/api/question/updateQuestion/:qid', updateQuestion);
    app.put('/api/question/updateQuestionView/:qid', updateQuestionView);
    app.delete('/api/question/deleteQuestion/:qid', deleteQuestion);
    app.get('/api/question/getQuestionDetailById/:qid', getQuestionDetailsById)
    app.get('/api/question/pinnedAnswer/:qid/:aid', pinAnAnswer)
};