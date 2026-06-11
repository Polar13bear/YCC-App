import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

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
