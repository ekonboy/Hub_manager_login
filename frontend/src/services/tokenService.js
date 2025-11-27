import API from './api';

export const fetchTokens = async () => {
  const res = await API.get('/tokens');
  return res.data.tokens;
};

export const createToken = async (userId, storeId) => {
  const res = await API.post('/tokens/create', { userId, storeId });
  return res.data.token;
};

export const validateToken = async (token) => {
  const res = await API.post('/tokens/validate', { token });
  return res.data;
};

export const deleteToken = async (token) => {
  const res = await API.delete(`/tokens/${token}`);
  return res.data;
};
