import axios from '../api/axiosInstance';

export const ChatService = {
  generateContent: async (prompt) => {
    return axios.post('/livechat', { 
      message: prompt 
    });
  }
};
