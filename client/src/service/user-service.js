import axios from 'axios';

const API_BASE = "http://localhost:8000";
const USER_API = `${API_BASE}/api/user`;

const request = axios.create({
    withCredentials: true,
});


export const findUserById = async (uid) => {
    const response = await request.get(`${USER_API}/${uid}`);
    return response.data.responseMessage;
}

export const userLogin = async (data) => {
    const response = await request.post(`${USER_API}/login`, data);
    return response.data;
}

export const userLogout = async () => {
    const response = await request.get(`${USER_API}/logout`);
    return response.data;
}

export const userRegister = async (data) => {
    const response = await request.post(`${USER_API}/register`, data);
    return response.data;
}

export const findAllUsers = async () => {
    const response = await request.get(`${USER_API}/allUsers`);
    return response.data.responseMessage;
}

export const getCurrentUserAccount = async () => {
    const response = await request.get(`${USER_API}/getAccountDetails`);
    console.log(response);
    return response.data;
}

export const getAllQuestionsByUser = async (sortType) => {
    const response = await request.get(`${USER_API}/getAllQuestionsByUser/${sortType}`);
    console.log(response);
    return response.data;
}

export const getAllAnswersByUser = async () => {
    const response = await request.get(`${USER_API}/getAllAnswersByUser`);
    console.log(response);
    return response.data;
}

export const getAllTagsByUser = async () => {
    const response = await request.get(`${USER_API}/getAllTagsByUser`);
    console.log(response);
    return response.data;
}

export const increaseReputation = async (uid) => {
    const response = await request.put(`${USER_API}/increaseReputation/${uid}`);
    return response.data;
}

export const decreaseReputation = async (uid) => {
    const response = await request.put(`${USER_API}/decreaseReputation/${uid}`);
    return response.data;
}
