import { apiClient } from './apiClient';

export const getAllContractors = async () => {
  return apiClient.get('/contractors');
};

export const getContractorById = async (id) => {
  return apiClient.get(`/contractors/${id}`);
};

export const getContractor = getContractorById;

export const getFeaturedContractors = async () => {
  return apiClient.get('/contractors/featured');
};

export const searchContractors = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.city) queryParams.append('city', params.city);
  if (params.specialization) queryParams.append('specialization', params.specialization);
  if (params.minRating) queryParams.append('minRating', params.minRating);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.query) queryParams.append('query', params.query);
  return apiClient.get(`/contractors?${queryParams.toString()}`);
};

export const saveContractor = async (id, email) => {
  const userEmail = email || JSON.parse(localStorage.getItem('user'))?.email || '';
  return apiClient.post(`/contractors/${id}/save?email=${encodeURIComponent(userEmail)}`, {});
};

export const unsaveContractor = async (id, email) => {
  const userEmail = email || JSON.parse(localStorage.getItem('user'))?.email || '';
  return apiClient.delete(`/contractors/${id}/save?email=${encodeURIComponent(userEmail)}`);
};

export const getSavedContractors = async (email) => {
  const userEmail = email || JSON.parse(localStorage.getItem('user'))?.email || '';
  return apiClient.get(`/contractors/saved?email=${encodeURIComponent(userEmail)}`);
};

