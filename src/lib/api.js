import axios from 'axios';

const api = axios.create({
  baseURL: 'https://admin.bookme.com.bd',
  withCredentials: true,
});

export default api;
