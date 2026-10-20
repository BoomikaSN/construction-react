import { apiClient } from './apiClient';

export const contactApi = {
  submitContact: async (contactData) => {
    return apiClient.post('/contact', contactData);
  }
};
