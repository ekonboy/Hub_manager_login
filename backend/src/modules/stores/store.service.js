const path = require('path');
const fs = require('fs');
const axios = require('axios');
const TokenService = require(path.join(__dirname, '..', 'tokens', 'token.service'));

const storesFile = path.join(__dirname, '..', '..', 'data', 'stores.json');

const StoreService = {
  // Listar stores estático
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
    const storesData = fs.readFileSync(storesFile, 'utf-8');
    const stores = JSON.parse(storesData);
    const store = stores.find(s => s.id === storeId);
    if (!store) throw new Error('Store no encontrada');

    const tokenObj = await TokenService.createToken(userId, storeId, store.username);

    const loginUrl = `${store.url.replace(/\/$/, '')}/wp-json/filament/v1/login?token=${tokenObj.token}`;

    return loginUrl;
  },

  // Sincronizar datos desde WP
  syncStore: async (data) => {
    const { url, logo, image, app_password } = data;
    if (!url) throw new Error('URL es requerida para sincronizar');

    const storesData = fs.readFileSync(storesFile, 'utf-8');
    let stores = JSON.parse(storesData);
    
    const normalize = (u) => u.replace(/\/$/, '').toLowerCase();
    const targetUrl = normalize(url);

    const storeIndex = stores.findIndex(s => normalize(s.url) === targetUrl);

    if (storeIndex === -1) throw new Error('Store no encontrada con esa URL: ' + url);

    if (logo) stores[storeIndex].logo = logo;
    if (image) stores[storeIndex].image = image;
    if (app_password) stores[storeIndex].app_password = app_password;

    fs.writeFileSync(storesFile, JSON.stringify(stores, null, 2));
    return stores[storeIndex];
  },

  // Listar stores con iconos dinámicos desde WP
  listStoresWithIcons: async () => {
    const storesData = fs.readFileSync(storesFile, 'utf-8');
    const stores = JSON.parse(storesData);

    const storesWithIcons = await Promise.all(
      stores.map(async store => {
        let platform_icons = store.platform_icons || [];
        let logo = store.logo || '';
        let image = store.image || '';

        // Solo si tiene WP
        if (store.platform && store.platform.includes("WP")) {
          try {
            const wpResponse = await axios.get(`${store.url.replace(/\/$/, '')}/wp-json/filament/v1/stores`);
            const wpData = wpResponse.data;

            if (wpData && wpData.length > 0) {
              // Obtener iconos, logo e imagen de WordPress
              if (wpData[0].platform_icons) {
                platform_icons = wpData[0].platform_icons;
              }
              if (wpData[0].logo) {
                logo = wpData[0].logo;
              }
              if (wpData[0].image) {
                image = wpData[0].image;
              }
            }
          } catch (err) {
            console.warn(`No se pudieron obtener datos WP de ${store.name}:`, err.message);
          }
        }

        // Asegurar que siempre tenga WordPress
        if (!platform_icons.includes("bi bi-wordpress")) platform_icons.unshift("bi bi-wordpress");

        return { ...store, platform_icons, logo, image };
      })
    );

    return storesWithIcons;
  }
};

module.exports = StoreService;
