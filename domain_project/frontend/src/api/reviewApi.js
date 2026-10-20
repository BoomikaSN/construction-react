import { apiClient } from './apiClient';

export const getRecentReviews = async () => {
  return apiClient.get('/reviews/recent');
};

export const getContractorReviews = async (contractorId) => {
  return apiClient.get(`/contractors/${contractorId}/reviews`);
};

export const submitReview = async (contractorId, reviewData) => {
  return apiClient.post(`/contractors/${contractorId}/reviews`, reviewData);
};

