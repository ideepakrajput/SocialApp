import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (email, password) => api.post('/users/login', { email, password });
export const signup = (userData) => api.post('/users/signup', userData);
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (userData) => api.patch('/users/profile', userData);
export const sendFriendRequest = (receiverId) => api.post('/users/friend-request', { receiverId });
export const acceptFriendRequest = (requesterId) => api.post('/users/accept-friend-request', { requesterId });
export const rejectFriendRequest = (requesterId) => api.post('/users/reject-friend-request', { requesterId });
export const getFeeds = () => api.get('/feed');
export const getUserPosts = () => api.get('/posts');
export const getAllUsers =  () => api.get('/users/');
export const createPost = (content) => api.post('/posts', { content });
export const addComment = (postId, content) => api.post(`/posts/${postId}/comment`, { content });
export const getPosts = () => api.get('/posts');
export const getPost = (postId) => api.get(`/posts/${postId}`);
export const updatePost = (postId, content) => api.put(`/posts/${postId}`, content);
export const deletePost = (postId) => api.delete(`/posts/${postId}`);

export default api;
