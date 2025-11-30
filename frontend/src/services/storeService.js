import API from './api';

// Obtener todas las stores
export const fetchStores = async () => {
  const res = await API.get('/stores'); 
  console.log('fetchStores backend response:', res.data);
  return res.data.data; // aquí debe existir "stores"
};

// Login automático usando token
export const loginStore = async (storeId, token) => {
  const res = await API.get(`/stores/${storeId}/login?token=${token}`);
  return res.data; // { status, message, login_url }
};

// Obtener detalles de una store
export const fetchStoreDetails = async (storeId) => {
  const res = await API.get(`/stores/${storeId}`);
  return res.data;
};

// Actualizar detalles de una store
export const updateStoreDetails = async (storeId, details) => {
  const res = await API.put(`/stores/${storeId}`, details);
  return res.data;
};
