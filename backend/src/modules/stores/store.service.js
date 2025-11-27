const path = require('path');
const fs = require('fs');
const TokenService = require(path.join(__dirname, '..', 'tokens', 'token.service'));

const storesFile = path.join(__dirname, '..', '..', 'data', 'stores.json');

const StoreService = {
  // Listar stores
  listStores: async () => {
    const data = fs.readFileSync(storesFile, 'utf-8');
    return JSON.parse(data);
  },

  // Crear store
  createStore: async (store) => {
    const data = fs.readFileSync(storesFile, 'utf-8');
    const stores = JSON.parse(data);
    store.id = stores.length + 1;
    stores.push(store);
    fs.writeFileSync(storesFile, JSON.stringify(stores, null, 2));
    return store;
  },

  // Generar token y devolver URL de login
  generateTokenAndSend: async (storeId, userId) => {
    // Leer stores
    const storesData = fs.readFileSync(storesFile, 'utf-8');
    const stores = JSON.parse(storesData);
    const store = stores.find(s => s.id === storeId);
    if (!store) throw new Error('Store no encontrada');

    // Crear token para este store y usuario
    const tokenObj = await TokenService.createToken(userId, storeId);

    // Construir URL de login automático
    const loginUrl = `${store.url.replace(/\/$/, '')}/wp-json/filament/v1/login?token=${tokenObj.token}`;

    return loginUrl;
  }
};

module.exports = StoreService;
