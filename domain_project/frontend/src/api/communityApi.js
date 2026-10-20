import { apiClient } from './apiClient';

export const communityApi = {
  getPosts: async () => {
    return apiClient.get('/community/posts');
  },
  
  getPostById: async (id) => {
    return apiClient.get(`/community/posts/${id}`);
  },
  
  createPost: async (postData) => {
    return apiClient.post('/community/posts', postData);
  },

  addReply: async (postId, replyData) => {
    return apiClient.post(`/community/posts/${postId}/replies`, replyData);
  },

  likePost: async (postId) => {
    return apiClient.put(`/community/posts/${postId}/like`, {});
  }
};
