import { api } from './api.service';
import { API_CONFIG } from '../config/api.config';

export const NotesService = {
  getAllNotes: () => api.get(API_CONFIG.ENDPOINTS.NOTES),
  
  getNote: (id) => api.get(`${API_CONFIG.ENDPOINTS.NOTES}/${id}`),
  
  createNote: (noteData) => api.post(API_CONFIG.ENDPOINTS.NOTES, noteData),
  
  updateNote: (id, noteData) => api.put(`${API_CONFIG.ENDPOINTS.NOTES}/${id}`, noteData),
  
  deleteNote: (id) => api.delete(`${API_CONFIG.ENDPOINTS.NOTES}/${id}`),
  
  shareNote: (id, shareData) => 
    api.post(`${API_CONFIG.ENDPOINTS.NOTES}/${id}/share`, shareData)
};