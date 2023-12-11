import axios from 'axios';

const API_BASE = "http://localhost:8000";
const QUESTION_API = `${API_BASE}/api/question`;

export const getFilteredQuestions = async (data, sortType) => {
    const response = await axios.get(`${QUESTION_API}/getFilteredQuestions/${sortType}`, data);
    return response.data.responseMessage;
}

export const getFilteredQuestionsByTag = async (data, sortType) => {
    const response = await axios.get(`${QUESTION_API}/getFilteredQuestionsByTag${sortType}`, data);
    return response.data.responseMessage;
}