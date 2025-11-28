import API from './api';

export const fetchStores = async () => {
  const res = await API.get('/stores'); // <--- asegúrate de que la ruta es correcta
  console.log('fetchStores backend response:', res.data); // <--- debug
  return res.data.data; // <--- aquí debe existir "stores"
};

export const loginStore = async (storeId, userId) => {
  const res = await API.post(`/stores/${storeId}/login?user_id=${userId}`);
  return res.data;
};
export const fetchStoreDetails = async (storeId) => {
  const res = await API.get(`/stores/${storeId}`);
  return res.data;
};
export const updateStoreDetails = async (storeId, details) => {
  const res = await API.put(`/stores/${storeId}`, details);
  return res.data;
};


