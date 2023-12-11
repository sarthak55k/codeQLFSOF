const tagDao = require('../dao/tags-dao.js')
const questionDao = require('../dao/questions-dao.js')
const ResponseClass = require('../service/response-service.js')
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
});
const findTags  = async (req, res) => {
    const tags = await tagDao.findTags();
    res.json(new ResponseClass(200, tags));
}


const findTagById  = async (req, res) => {
    const tid = req.params.tid;
    const tag = await tagDao.findTagById(tid);
    res.json(new ResponseClass(200, tag));
}

const findTagByName  = async (req, res) => {
    const tagName = req.params.name;
    const tag = await tagDao.findTagByName(tagName);
    res.json(new ResponseClass(200, tag));
}

const saveTag = async (req, res) => {
    const newTag = req.body;
    try {
        const savedTag = await tagDao.createTag(newTag);
        console.log('Tag created successfully:', savedTag);
        res.json(new ResponseClass(200, savedTag));
    } catch (error) {
        console.error('Error creating tag:', error.message);
        if (error.code === 11000) {
            return res.json(new ResponseClass(409, 'Tag with the same name already exists'));
        }
        res.json(new ResponseClass(500, error.message));
    }
}

const updateTag = async (req, res) => {
    const currentUser = req.session["currentUser"];
    try {
        if (currentUser) {
            const tagIdToUpdate = req.params.tid;
            const tagBody = req.body;
            const count = await questionDao.findTagCount(tagIdToUpdate);
            if (count > 1) {
                res.json(new ResponseClass(409, "Tag being used by in other questions"));
            } else if (count === 1) {
                const status = await tagDao
                    .updateTag(tagIdToUpdate,
                        tagBody);
                res.json(new ResponseClass(200, status));
            } else {
                res.json(new ResponseClass(404, "Tag Not Present"));
            }
        } else {
            res.json(new ResponseClass(401, "User not LoggedIn"));
        }
    } catch (error) {
        res.json(new ResponseClass(500, "Internal server error"));
    }
}

const deleteTag = async (req, res) => {
    const currentUser = req.session["currentUser"];
    try {
        if (currentUser) {
            const tagIdToDelete = req.params.tid;
            const questions = await questionDao.findTagCount(tagIdToDelete);
            console.log(questions.length)
            if (questions.length > 1) {
                res.json(new ResponseClass(403, "Tag being used in other questions"));
            } else if (questions.length === 1) {
                if (questions[0].asked_by.toString() === currentUser._id) {
                    await questionDao.deleteTagFromQuestions(tagIdToDelete);
                    const status = await tagDao
                        .deleteTag(tagIdToDelete);
                    res.json(new ResponseClass(200, status));
                } else {
                    res.json(new ResponseClass(403, "Tag being used in other questions"));
                }
            } else {
                res.json(new ResponseClass(404, "Tag Not Present"));
            }
        } else {
            res.json(new ResponseClass(401, "User not LoggedIn"));
        }
    } catch (error) {
        res.json(new ResponseClass(500, "Internal server error"));
    }
}

module.exports = (app) => {
    app.use('/api/tag/allTags', limiter);
    app.use('/api/tag/:tid', limiter);
    app.use('/api/tag/getTagByName/:name', limiter);
    app.use('/api/tag/saveTag', limiter);
    app.use('/api/tag/updateTag/:tid', limiter);
    app.use('/api/tag/deleteTag/:tid', limiter);

    app.get('/api/tag/allTags', findTags);
    app.get('/api/tag/:tid', findTagById);
    app.get('/api/tag/getTagByName/:name', findTagByName);
    app.post('/api/tag/saveTag', saveTag);
    app.put('/api/tag/updateTag/:tid', updateTag);
    app.delete('/api/tag/deleteTag/:tid', deleteTag);
};
