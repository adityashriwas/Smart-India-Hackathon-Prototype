import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // adjust when hosted

const api = axios.create({ baseURL: API_BASE });
export default api;
