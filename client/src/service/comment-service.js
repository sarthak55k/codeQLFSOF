import axios from 'axios';
const API_BASE = "http://localhost:8000";
const COMMENT_API = `${API_BASE}/api/comment`;

const request = axios.create({
    withCredentials: true,
});
export const getAllComments = async () => {
    const response = await axios.get(`${COMMENT_API}/allComments`);
    return response.data.responseMessage;
}

export const getCommentById = async (cid) => {
    const response = await axios.get(`${COMMENT_API}/getCommentsById/${cid}`);
    return response.data.responseMessage;
}

export const createComment = async (comment) => {
    const response = await request.post(`${COMMENT_API}/createComment`, comment);
    return response.data.responseMessage;
}

export const voteUp = async (cId) => {
    const response = await request.get(`${COMMENT_API}/voteUp/${cId}`);
    return response.data.responseMessage;
}