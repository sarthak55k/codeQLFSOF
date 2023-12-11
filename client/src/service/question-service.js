import axios from 'axios';

const API_BASE = "http://localhost:8000";
const QUESTION_API = `${API_BASE}/api/question`;

const request = axios.create({
    withCredentials: true,
});

export const getAllQuestion = async (sortType) => {
    const response = await axios.get(`${QUESTION_API}/allQuestions/${sortType}`);
    return response.data.responseMessage;
}

export const getQuestionById = async (qid) => {
    const response = await axios.get(`${QUESTION_API}/${qid}`);
    return response.data.responseMessage;
}

export const saveQuestion = async (question) => {
    console.log(question);
    const response = await request.post(`${QUESTION_API}/saveQuestion`, question);
    return response.data;
}

export const addAnswerId = async (aid, qid) => {
    const response = await request.post(`${QUESTION_API}/addAnswerId/${aid}/${qid}`);
    return response.data;
}
export const updateQuestion = async (data, qid) => {
    const response = await request.put(`${QUESTION_API}/updateQuestion/${qid}`, data);
    return response.data;
}

export const deleteQuestion = async (qid) => {
    const response = await request.delete(`${QUESTION_API}/deleteQuestion/${qid}`);
    return response.data;
}

export const incrementView = async (qid) => {
    const response = await request.put(`${QUESTION_API}/updateQuestionView/${qid}`, qid);
    return response.data;
}
/**
 * tag
 * {
 *     "name" : "android-studio"
 * }
 */
export const getFilteredQuestionsByTag = async (tag, sortType) => {
    const response = await axios.post(`${QUESTION_API}/getFilteredQuestionsByTag/${sortType}`, {name: tag});
    return response.data.responseMessage;
}

/**
 * searchParams
 * {
 *     "tagParams" : ["javascript"],
 *     "searchParams" : ["bottom", "animation", "activity"]
 * }
 */
export const getFilteredQuestions = async (searchParams, sortType) => {
    const response = await axios.post(`${QUESTION_API}/getFilteredQuestions/${sortType}`, searchParams);
    console.log(response);
    return response.data;
}

export const voteUp = async (qid) => {
    const response = await request.get(`${QUESTION_API}/voteUp/${qid}`);
    return response.data;
}

export const voteDown = async (qid) => {
    const response = await request.get(`${QUESTION_API}/voteDown/${qid}`);
    return response.data;
}

export const getQuestionDetailById = async (qid) => {
    const response = await axios.get(`${QUESTION_API}/getQuestionDetailById/${qid}`);
    return response.data.responseMessage;
}

export const addCommentIdToQuestion = async (qid, cid) => {
    const response = await axios.get(`${QUESTION_API}/addComment/${qid}/${cid}`);
    return response.data.responseMessage;
}

export const pinAnswer = async (qid, aid) => {
    const response = await request.get(`${QUESTION_API}/pinnedAnswer/${qid}/${aid}`);
    return response.data.responseMessage;
}