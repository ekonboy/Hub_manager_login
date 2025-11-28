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
    const tokenObj = await TokenService.createToken(userId, storeId, store.username);

    // Construir URL de login automático
    const loginUrl = `${store.url.replace(/\/$/, '')}/wp-json/filament/v1/login?token=${tokenObj.token}`;

    return loginUrl;
  },

  // Sincronizar datos desde WP (actualizar por URL)
  syncStore: async (data) => {
    const { url, logo, image, app_password } = data;
    if (!url) throw new Error('URL es requerida para sincronizar');

    const storesData = fs.readFileSync(storesFile, 'utf-8');
    let stores = JSON.parse(storesData);
    
    // Normalizar URL para comparación (quitar slash final)
    const normalize = (u) => u.replace(/\/$/, '').toLowerCase();
    const targetUrl = normalize(url);

    const storeIndex = stores.findIndex(s => normalize(s.url) === targetUrl);

    if (storeIndex === -1) {
        // Opción: Crear si no existe? Por ahora solo actualizamos.
        throw new Error('Store no encontrada con esa URL: ' + url);
    }

    // Actualizar campos
    if (logo) stores[storeIndex].logo = logo;
    if (image) stores[storeIndex].image = image;
    if (app_password) stores[storeIndex].app_password = app_password;

    fs.writeFileSync(storesFile, JSON.stringify(stores, null, 2));
    return stores[storeIndex];
  }
};

module.exports = StoreService;
