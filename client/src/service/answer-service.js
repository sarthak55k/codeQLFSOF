import axios from 'axios';

const API_BASE = "http://localhost:8000";
const ANSWER_API = `${API_BASE}/api/answer`;

const request = axios.create({
    withCredentials: true,
});

export const getAllAnswer = async () => {
    const response = await axios.get(`${ANSWER_API}/allAnswers`);
    return response.data.responseMessage;
}

export const getAnswerById = async (aid) => {
    const response = await axios.get(`${ANSWER_API}/${aid}`);
    return response.data.responseMessage;
}

export const saveAnswer = async (answer) => {
    const response = await request.post(`${ANSWER_API}/saveAnswer`, answer);
    return response.data;
}

export const updateAnswer = async (data, aid) => {
    const response = await request.put(`${ANSWER_API}/updateAnswer/${aid}`, data);
    return response.data.responseMessage;
}

export const deleteAnswer = async (aid) => {
    const response = await request.delete(`${ANSWER_API}/deleteAnswer/${aid}`);
    return response.data.responseMessage;
}

export const addComment = async (aid, cid) => {
    const response = await request.get(`${ANSWER_API}/addComment/${aid}/${cid}`);
    return response.data.responseMessage;
}

export const voteUp = async (aid) => {
    const response = await request.get(`${ANSWER_API}/voteUp/${aid}`);
    return response.data;
}

export const voteDown = async (aid) => {
    const response = await request.get(`${ANSWER_API}/voteDown/${aid}`);
    return response.data;
}