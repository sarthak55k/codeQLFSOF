const userDao = require('../dao/users-dao.js')

const bcryptFunctions = require('../service/password-encryption-service.js');
const ResponseClass = require('../service/response-service.js')
const sortService = require("../service/question-sort-service");

const findUsers  = async (req, res) => {
    try {
        const users = await userDao.findUsers();
        let responseClass = new ResponseClass(200, users)
        res.json(responseClass);
    } catch(error) {
        console.error(error);
        const errorResponse = new ResponseClass(500, 'Internal Server Error');
        res.json(errorResponse);
    }
}

const findUserById = async (req, res) => {
    try {
        const uid = req.params.uid;
        console.log(uid);
        const user = await userDao.findUserById(uid);
        const responseService = new ResponseClass(200, user);
        res.json(responseService);
    } catch (error) {
        console.error(error);
        const errorResponse = new ResponseClass(500, 'Internal Server Error');
        res.json(errorResponse);
    }
};

const findUserByEmail  = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await userDao.findUserByEmail(email);
        if (user.length > 0) {
            res.json(new ResponseClass(200, user));
        } else {
            res.json(new ResponseClass(403, "user not found"));
        }
    } catch (error) {
        console.error(error);
        const errorResponse = new ResponseClass(500, 'Internal Server Error');
        res.json(errorResponse);
    }
}

const findUserByUsername  = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await userDao.findUserByUsername(username);
        if (user.length > 0) {
            res.json(new ResponseClass(200, user));
        } else {
            res.json(new ResponseClass(403, "user not found"));
        }
    } catch (error) {
        console.error(error);
        const errorResponse = new ResponseClass(500, 'Internal Server Error');
        res.json(errorResponse);
    }
}

const registerUser = async (req, res) => {
    try {
        const newUser = req.body;
        const userWithEmail = await userDao.findUserByEmail(newUser.email);
        if (userWithEmail.length > 0) {
            res.json(new ResponseClass(304, "Account already available with this email"));
        } else {
            const userWithUsername = await userDao.findUserByUsername(newUser.username);
            if (userWithUsername.length > 0) {
                res.json(new ResponseClass(304, "Account already available with this username"));
            } else {
                const password = newUser.password;
                const hash = await new Promise((resolve, reject) => {
                    bcryptFunctions.cryptPassword(password, function(err, hash) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(hash);
                        }
                    });
                });
                console.log(hash);
                newUser.password = hash;

                // eslint-disable-next-line no-unused-vars
                const registeredUser = await userDao.createUser(newUser);
                res.json(new ResponseClass(200, "Successfully Registered"));
            }
        }
    } catch(error) {
        console.error(error);
        const errorResponse = new ResponseClass(500, 'Internal Server Error');
        res.json(errorResponse);
    }
}

const increaseReputation = async(req, res) => {
    try {
        const currentUser = req.session["currentUser"];

        if (currentUser) {
            const uid = req.params.uid;
            let user = await userDao.findUserById(uid);
            user.reputation += 5;
            await userDao.updateUser(uid, user);
            res.json(new ResponseClass(200, "reputation increased"));
        } else {
            res.json(new ResponseClass(401, "Login to increase reputation"));
        }
    } catch(error) {
        console.error(error);
        const errorResponse = new ResponseClass(500, 'Internal Server Error');
        res.json(errorResponse);
    }
}

const decreaseReputation = async(req, res) => {
    try {
        const currentUser = req.session["currentUser"];

        if (currentUser) {
            const uid = req.params.uid;
            let user = await userDao.findUserById(uid);
            user.reputation -= 10;
            await userDao.updateUser(uid, user);
            res.json(new ResponseClass(200, "reputation decreased"));
        } else {
            res.json(new ResponseClass(401, "Login to decrease reputation"));
        }
    } catch(error) {
        console.error(error);
        const errorResponse = new ResponseClass(500, 'Internal Server Error');
        res.json(errorResponse);
    }
}
const loginUser = async (req, res) => {
    try {
        console.log(req.body)
        let username = req.body.username;
        let password = req.body.password;
        const user = await userDao.findUserByUsername(username);
        if (user.length > 0) {
            const hashedPassword = user[0].password;
            const isMatch = await new Promise((resolve, reject) => {
                bcryptFunctions.comparePassword(password, hashedPassword, function(err, isMatch) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(isMatch);
                        resolve(isMatch);
                    }
                });
            });
            if (isMatch) {
                console.log(user[0]);
                req.session['currentUser'] = user[0];
                res.json(new ResponseClass(200, user[0]));

            } else {
                res.json(new ResponseClass(401, "Incorrect Password"));
            }
        } else {
            res.json(new ResponseClass(404, "User Not Present/Username Incorrect"))
        }
    } catch(error) {
        console.error(error);
        const errorResponse = new ResponseClass(500, 'Internal Server Error');
        res.json(errorResponse);
    }
}

const logoutUser = (req, res) => {
    req.session.destroy();
    res.json(new ResponseClass(200, "User Logged Out"));
};

const getUserAccount = async (req, res) => {
    console.log(req.session['currentUser']);
    const currentUser = req.session['currentUser']
    try {
        if (currentUser) {
            res.json(new ResponseClass(200, currentUser));
        } else {
            res.json(new ResponseClass(401, "User not logged in"));
        }
    } catch (error) {
        console.error('Error fetching user answers:', error);
        res.json(new ResponseClass(500, 'Internal Server Error'));
    }
}

const deleteUser = async (req, res) => {
    try {
        const userIdToDelete = req.params.uid;
        const status = await userDao
            .deleteUser(userIdToDelete);
        res.json(status);
    } catch(error) {
        console.error(error);
        const errorResponse = new ResponseClass(500, 'Internal Server Error');
        res.json(errorResponse);
    }
}

const updateUser = async (req, res) => {
    try {
        const updateUser = req.body;
        const userWithEmail = await userDao.findUserByEmail(updateUser.email);
        if (userWithEmail.length > 0) {
            if (userWithEmail[0].email !== updateUser.email) {
                console.log(userWithEmail[0].email);
                console.log(updateUser.email);
                res.json(new ResponseClass(403, "Changing Email not allowed"));
            } else if (userWithEmail[0].username !== updateUser.username) {
                res.json(new ResponseClass(403, "Changing Username not allowed"));
            } else {
                const password = updateUser.password;
                const hash = await new Promise((resolve, reject) => {
                    bcryptFunctions.cryptPassword(password, function(err, hash) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(hash);
                        }
                    });
                });
                console.log(hash);
                updateUser.password = hash;
                const updatedUser = await userDao.updateUser(userWithEmail[0]._id, updateUser);
                res.json(new ResponseClass(200, updatedUser));
            }
        } else {
            res.json(new ResponseClass(404, "No User found with this email or username"));
        }
    } catch(error) {
        console.error(error);
        const errorResponse = new ResponseClass(500, 'Internal Server Error');
        res.json(errorResponse);
    }
}

const getAllQuestionsByUser = async (req, res) => {
    if (req.session['currentUser']) {
        const cuid = req.session['currentUser']._id;
        const allUserAnswers = await userDao.questionsByUsers(cuid);
        const sortType = req.params.sortType;
        const sortClass = await sortService.createSorter(sortType);
        const sortedUserQuestions = await sortClass.sort(allUserAnswers);
        res.json(new ResponseClass(200, sortedUserQuestions));
    } else {
        res.json(new ResponseClass(401, "user not logged in"));
    }
}
const getAllAnswersByUser = async (req, res) => {
    try {
        console.log(req.session['currentUser']);
        if (req.session['currentUser']) {
            const cuid = req.session['currentUser']._id;
            const allUserAnswers = await userDao.answersByUsers(cuid);
            res.json(new ResponseClass(200, allUserAnswers));
        } else {
            res.json(new ResponseClass(401, "User not logged in"));
        }
    } catch (error) {
        console.error('Error fetching user answers:', error);
        res.json(new ResponseClass(500, 'Internal Server Error'));
    }
}

const getAllTagsByUser = async (req, res) => {
    if (req.session['currentUser']) {
        const cuid = req.session['currentUser']._id;
        const allUserTags = await userDao.tagByUsers(cuid);
        res.json(new ResponseClass(200, allUserTags));
    } else {
        res.json(new ResponseClass(401, "user not logged in"));
    }
}
module.exports = (app) => {
    app.get('/api/user/allUsers', findUsers);
    app.get('/api/user/userById/:uid', findUserById);
    app.get('/api/user/userByUsername/:username', findUserByUsername);
    app.get('/api/user/userByEmail/:email', findUserByEmail);
    app.post('/api/user/login', loginUser);
    app.post('/api/user/register', registerUser);
    app.put('/api/user/updateUser', updateUser);
    app.delete('/api/user/deleteUser/:tid', deleteUser);
    app.put('/api/user/increaseReputation/:uid', increaseReputation);
    app.put('/api/user/decreaseReputation/:uid', decreaseReputation);
    app.get('/api/user/getAccountDetails', getUserAccount)
    app.get('/api/user/logout', logoutUser)
    app.get('/api/user/getAllQuestionsByUser/:sortType', getAllQuestionsByUser)
    app.get('/api/user/getAllAnswersByUser', getAllAnswersByUser)
    app.get('/api/user/getAllTagsByUser', getAllTagsByUser)
};
