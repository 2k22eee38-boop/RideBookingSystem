import axios from 'axios';

const API = "http://localhost:8080/auth";

// Intercept requests to include the JWT token
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const login = async (data) => {
  const response = await axios.post(`${API}/login`, data);
  if (response.data.token) {
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const register = async (data) => {
  const response = await axios.post(`${API}/register`, data);
  if (response.data.token) {
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

export default {
  login,
  register,
  logout
};