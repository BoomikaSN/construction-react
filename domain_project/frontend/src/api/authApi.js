import { apiClient } from './apiClient';

export const login = async (email, password, role) => {
  return apiClient.post('/login', { email, password, role });
};

export const register = async (email, password, role) => {
  return apiClient.post('/register', { email, password, role });
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('user-state-change'));
};

export const getProfile = async () => {
  return apiClient.get('/profile');
};

export const updateProfile = async (profileData) => {
  return apiClient.put('/profile', profileData);
};

export const authApi = {
  login,
  register,
  getCurrentUser,
  logout,
  getProfile,
  updateProfile
};
