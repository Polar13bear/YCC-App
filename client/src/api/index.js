import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'https://ycc-app-server.onrender.com/api' 
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ycc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ycc_token');
      localStorage.removeItem('ycc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);
export const getMe = () => API.get('/auth/me');

// Batches
export const getBatches = () => API.get('/batches');
export const getBatch = (id) => API.get(`/batches/${id}`);
export const createBatch = (data) => API.post('/batches', data);
export const updateBatch = (id, data) => API.put(`/batches/${id}`, data);
export const deleteBatch = (id) => API.delete(`/batches/${id}`);

// Students
export const getStudents = (params) => API.get('/students', { params });
export const getStudent = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// Attendance
export const getAttendance = (params) => API.get('/attendance', { params });
export const markAttendance = (data) => API.post('/attendance', data);
export const getAttendanceStats = (studentId) => API.get(`/attendance/stats/${studentId}`);
export const getBatchAttendanceSummary = (batchId) => API.get(`/attendance/summary/${batchId}`);
