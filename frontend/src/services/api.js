import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // apunta a tu backend
});

export default API;
