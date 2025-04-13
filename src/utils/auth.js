export const getToken = () => {
    return localStorage.getItem('authToken');
  };
  
  export const setToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  
  export const clearToken = () => {
    localStorage.removeItem('authToken');
  };

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // your FastAPI backend
});

export default API;