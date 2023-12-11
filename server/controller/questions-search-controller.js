const questionDao = require("../dao/questions-dao.js");
const tagDao = require("../dao/tags-dao.js")
const sortService = require("../service/question-sort-service.js")

const getFilteredQuestions = async (req, res) => {
    const filterParams = req.body
    const tagParams = filterParams.tagParams;
    const searchParams = filterParams.searchParams;
    const questions  = [];
    for(let tag in tagParams) {
        let tagName = tagParams[tag];
        const tid = await tagDao.findTagByName(tagName)
        if (tid.length > 0) {
            const question = await questionDao.findQuestionByTagId(tid[0]._id);
            for (let q in question) {
                if (!questions.includes(question[q])) {
                    questions.push(question[q]);
                }
            }
        }
    }
    for(let search in searchParams) {
        let searchName = searchParams[search];
        const question = await questionDao.findQuestionBySearchParams(searchName);
        if (question.length > 0) {
            for (let q in question) {
                if (!questions.includes(question[q])) {
                    questions.push(question[q]);
                }
            }
        }
    }
    const deduplicatedArray = removeDuplicates(questions);
    const sortClass = await sortService.createSorter(req.params.sortType)
    const sortedDeDuplicatedArray = await sortClass.sort(deduplicatedArray);
    res.json(sortedDeDuplicatedArray);
}

function removeDuplicates(questions) {
    const uniqueIds = {};

    return questions.filter(obj => {
        if (!uniqueIds[obj._id]) {
            uniqueIds[obj._id] = true;
            return true;
        }
        return false;
    });
}
const getFilteredQuestionsByTag = async (req, res) => {
    console.log(req.body.name)
    const tid = await tagDao.findTagByName(req.body.name)
    if(tid.length > 0) {
        const questions = await questionDao.findQuestionByTagId(tid[0]._id);
        const sortClass = await sortService.createSorter(req.params.sortType);
        const sortedDeDuplicatedArray = await sortClass.sort(questions);
        res.json(sortedDeDuplicatedArray);
    } else {
        res.json([])
    }
}

module.exports = (app) => {
    app.post('/api/question/getFilteredQuestions/:sortType', getFilteredQuestions);
    app.post('/api/question/getFilteredQuestionsByTag/:sortType', getFilteredQuestionsByTag);
};