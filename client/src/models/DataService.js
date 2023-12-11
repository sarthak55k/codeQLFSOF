import questionData from './model'

let instance;

class DataService {
    constructor(data) {
        if (instance) {
            throw new Error("You can only create one instance!");
        }
        this.data = data;
        this.questions = data.questions;
        this.tags = data.tags;
        this.answers = data.answers;
        instance = this;
    }
    getQuestionById(id) {
        return this.questions.find(question => question.qid === id);
    }

    getAllData() {
        return this.data;
    }

    getAllQuestions() {
        return this.questions;
    }

    getQuestionsByTag(tagId) {
        return this.questions.filter(question => question.tagIds.includes(tagId));
    }

    getTagById(id) {
        return this.tags.find(tag => tag.tid === id);
    }

    getAllTags() {
        return this.tags;
    }
    getAnswerById(id) {
        return this.answers.find(answer => answer.aid === id);
    }

    addQuestion(newQuestion) {
        this.questions.push(newQuestion);
    }

    addTag(Tag) {
        this.tags.push({tid: Tag.tid, name: Tag.name});
    }

    addAnswer(newAnswer) {
        this.answers.push(newAnswer);
    }
}

const dataService = Object.freeze(new DataService(questionData));
export default dataService;
