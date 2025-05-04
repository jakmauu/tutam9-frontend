import axios from 'axios';

const API_URL = 'https://tutam9-backend-d4m9ycz9z-dzakys-projects-91c39113.vercel.app/api';

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_URL
});

// Existing code - Interceptor ini sudah benar
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Assignments API
export const getAssignments = async () => {
  const response = await api.get('/assignments');
  return response.data;
};

export const getAssignmentsByDay = async (day) => {
  const response = await api.get(`/assignments/day/${day}`);
  return response.data;
};

export const createAssignment = async (assignmentData) => {
  const response = await api.post('/assignments', assignmentData);
  return response.data;
};

export const updateAssignment = async (id, assignmentData) => {
  const response = await api.patch(`/assignments/${id}`, assignmentData);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await api.delete(`/assignments/${id}`);
  return response.data;
};

export const searchAssignments = async (query) => {
  const response = await api.get(`/assignments/search?query=${query}`);
  return response.data;
};

export default api;