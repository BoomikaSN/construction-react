import { apiClient } from './apiClient';

export const getContractorProjects = async (contractorId) => {
  return apiClient.get(`/contractors/${contractorId}/projects`);
};

export const projectApi = {
  getAll: async () => {
    return apiClient.get('/projects');
  },
  
  getById: async (id) => {
    return apiClient.get(`/projects/${id}`);
  },
  
  getByContractorId: getContractorProjects,
  
  createProject: async (projectData) => {
    return apiClient.post('/projects', projectData);
  }
};

