import { apiClient } from './apiClient';

export const submitQuote = async (quoteData) => {
  return apiClient.post('/quotes', quoteData);
};

export const getContractorQuotes = async () => {
  return apiClient.get('/quotes/contractor');
};

export const getClientQuotes = async () => {
  return apiClient.get('/quotes/client');
};

export const updateQuoteStatus = async (quoteId, statusData) => {
  return apiClient.put(`/quotes/${quoteId}/status`, statusData);
};
