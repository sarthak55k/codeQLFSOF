const express = require("express")
const cors = require('cors')
const questions = require('./controller/questions-controller.js')
const tags = require('./controller/tags-controller.js')
const answers = require('./controller/answers-controller.js')
const searchQuestions = require('./controller/questions-search-controller.js')
const databaseConnection = require('./service/database-service.js')
const users = require('./controller/users-controller.js')
const comments = require('./controller/comments-controller.js')
const session = require("express-session");

//const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/stack_over_flow'
const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/fake_so2'

const connection = Object.freeze(new databaseConnection(CONNECTION_STRING));
connection.connect();

const app = express()
// eslint-disable-next-line no-undef
console.log("type secret key :")
const secret = process.argv[2];
app.use(express.urlencoded({ extended: false }))
console.log(secret)
app.use(cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
)
const sessionOptions = {
    secret: `${secret}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: true,
        maxAge: 86400000,
    },
};
app.use(
    session(sessionOptions)
);

app.use(express.json());
questions(app);
answers(app);
tags(app);
searchQuestions(app);
users(app);
comments(app);

// eslint-disable-next-line no-undef
app.listen(process.env.PORT || 8000);
