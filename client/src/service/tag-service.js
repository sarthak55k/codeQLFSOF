import axios from 'axios';

const API_BASE = "http://localhost:8000";
const TAG_API = `${API_BASE}/api/tag`;

const request = axios.create({
    withCredentials: true,
});

export const getAllTags = async () => {
    const response = await axios.get(`${TAG_API}/allTags`);
    return response.data.responseMessage;
}

export const getTagById = async (tid) => {
    const response = await axios.get(`${TAG_API}/${tid}`);
    return response.data.responseMessage;
}

export const getTagByName = async (tagName) => {
    const response = await axios.get(`${TAG_API}/getTagByName/${tagName}`);
    return response.data.responseMessage;
}

export const saveTag = async (tag) => {
    const response = await axios.post(`${TAG_API}/saveTag`, tag);
    return response.data.responseMessage;
}

export const updateTag = async (data, tid) => {
    const response = await request.put(`${TAG_API}/updateTag/${tid}`, data);
    return response.data;
}

export const deleteTag = async (tid) => {
    const response = await request.delete(`${TAG_API}/deleteTag/${tid}`);
    return response.data;
}