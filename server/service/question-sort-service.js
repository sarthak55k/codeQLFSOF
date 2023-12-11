const answerDao = require("../dao/answers-dao.js");

class UnansweredSorter {
    async sort(questions) {
        return questions.filter(question => question.answers.length === 0);
    }
}

class ActiveSorter {
    constructor(answerDao) {
        this.answerDao = answerDao;
    }

    async sort(questions) {
        questions.sort((a, b) => {
            const keyA = new Date(a.last_active),
                keyB = new Date(b.last_active);
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        });
        return questions;
    }
}

class NewestSorter {
    async sort(questions) {
        questions.sort((a, b) => {
            const keyA = new Date(a.ask_date_time),
                keyB = new Date(b.ask_date_time);
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        });
        return questions;
    }
}

class QuestionSortFactory {
    constructor(answerDao) {
        this.answerDao = answerDao;
    }

    createSorter(sortType) {
        switch (sortType) {
            case 'unanswered':
                return new UnansweredSorter();
            case 'active':
                return new ActiveSorter(this.answerDao);
            case 'newest':
                return new NewestSorter();
            default:
                throw new Error('Invalid sortType');
        }
    }
}
const q = new QuestionSortFactory(answerDao);
module.exports = q;
