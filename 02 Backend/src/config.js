export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://safetysolution.onrender.com/api'
    : 'http://localhost:3001/api'
};