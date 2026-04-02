import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', { phoneNumber: data.phoneNumber }),
};

export const complaintAPI = {
    create: (data) => api.post('/complaints', data),
    getNearby: (lat, lng, radius = 5) => api.get(`/complaints/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
    getUserComplaints: (userId) => api.get(`/complaints/user/${userId}`),
    getDuplicates: (lat, lng, title) => api.get(`/complaints/duplicates?lat=${lat}&lng=${lng}&title=${title}`),
    updateStatus: (id, status) => api.put(`/complaints/${id}/status?status=${status}`),
    upvote: (id) => api.post(`/complaints/${id}/upvote`),
    getById: (id) => api.get(`/complaints/${id}`),
};

export const dashboardAPI = {
    getStats: (lat, lng, radius = 5) => api.get(`/dashboard/stats?lat=${lat}&lng=${lng}&radius=${radius}`),
    getGlobalStats: () => api.get('/dashboard/global-stats'),
};

export default api;
