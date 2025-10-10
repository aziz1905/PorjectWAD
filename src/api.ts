import axios from 'axios';

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  // URL base dari backend Anda. Sesuaikan port jika berbeda.
  baseURL: 'http://localhost:5000' 
});

export default api;