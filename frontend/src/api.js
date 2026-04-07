import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('saheli_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  
  const res = await api.post('/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.data;
};

export const logout = () => { /* optional callback utility */ };

export const getCases = () => api.get('/cases').then(res => res.data);
export const getCase = (id) => api.get(`/cases/${id}`).then(res => res.data);
export const getNgos = () => api.get('/ngos').then(res => res.data);
export const getAnalytics = () => api.get('/analytics').then(res => res.data);
export const getTimeSeries = () => api.get('/analytics/time-series').then(res => res.data);
export const getFieldWorkers = (ngoId) => api.get(`/ngos/${ngoId}/workers`).then(res => res.data);
export const updateCase = (id, data) => api.patch(`/cases/${id}`, data).then(res => res.data);
export const sendWhatsAppMessage = (phone, message) => api.post('/webhook/whatsapp', { phone_number: phone, message: message }).then(res => res.data);
export const submitWebReport = (data) => api.post('/cases', data).then(res => res.data);

// NGO CRM APIs
export const addWorker = (workerData) => api.post('/workers', workerData).then(res => res.data);
export const deleteWorker = (workerId) => api.delete(`/workers/${workerId}`).then(res => res.data);
export const updateNgoProfile = (profileData) => api.patch('/ngos/profile', profileData).then(res => res.data);

export default api;
