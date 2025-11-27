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


// export const fetchStoreUsers = async (storeId) => {
//   const res = await API.get(`/stores/${storeId}/users`);
//   return res.data.users;
// };
// export const addUserToStore = async (storeId, userData) => {
//   const res = await API.post(`/stores/${storeId}/users`, userData);
//   return res.data;
// };
// export const removeUserFromStore = async (storeId, userId) => {
//   const res = await API.delete(`/stores/${storeId}/users/${userId}`);
//   return res.data;
// };
// export const fetchStorePasswords = async (storeId) => {
//   const res = await API.get(`/stores/${storeId}/passwords`);
//   return res.data.passwords;
// } ;
// export const addPasswordToStore = async (storeId, passwordData) => {
//   const res = await API.post(`/stores/${storeId}/passwords`, passwordData);
//   return res.data;
// };
// export const removePasswordFromStore = async (storeId, passwordId) => {
//     const res = await API.delete(`/stores/${storeId}/passwords/${passwordId}`);
//     return res.data;
// };
