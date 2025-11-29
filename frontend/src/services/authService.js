import API from './api';

// Login
export const login = async (username, password) => {
  const response = await API.post('/auth/login', {
    username,
    password
  });
  return response.data;
};

// Verify token
export const verifyToken = async (token) => {
  const response = await API.post('/auth/verify', {
    token
  });
  return response.data;
};

export default {
  login,
  verifyToken
};
