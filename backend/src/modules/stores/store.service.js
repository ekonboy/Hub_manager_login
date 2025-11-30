const path = require('path');
const fs = require('fs');
const axios = require('axios');
const TokenService = require(path.join(__dirname, '..', 'tokens', 'token.service'));

const getStoresFilePath = () => {
  const possiblePaths = [
    path.join(process.cwd(), 'src', 'data', 'stores.json'),
    path.join(__dirname, '..', '..', 'data', 'stores.json'),
    path.join(process.cwd(), 'backend', 'src', 'data', 'stores.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0]; // Default to first one if none found
};

const StoreService = {
  // Listar stores estático
  listStores: async () => {
    const filePath = getStoresFilePath();
    console.log('Intentando leer stores de:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('ARCHIVO NO ENCONTRADO:', filePath);
      throw new Error(`Archivo stores.json no encontrado en: ${filePath}`);
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  },

  // Crear store
  createStore: async (store) => {
    const filePath = getStoresFilePath();
    const data = fs.readFileSync(filePath, 'utf-8');
    const stores = JSON.parse(data);
    store.id = stores.length + 1;
    stores.push(store);
    // Nota: En Vercel esto fallará porque es read-only, pero funciona en local
    try {
      fs.writeFileSync(filePath, JSON.stringify(stores, null, 2));
    } catch (e) {
      console.warn('No se pudo escribir en stores.json (probablemente entorno read-only):', e.message);
    }
    return store;
  },

  // Generar token y devolver URL de login
  generateTokenAndSend: async (storeId, userId) => {
    const filePath = getStoresFilePath();
    const storesData = fs.readFileSync(filePath, 'utf-8');
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

    const filePath = getStoresFilePath();
    const storesData = fs.readFileSync(filePath, 'utf-8');
    let stores = JSON.parse(storesData);
    
    const normalize = (u) => u.replace(/\/$/, '').toLowerCase();
    const targetUrl = normalize(url);

    const storeIndex = stores.findIndex(s => normalize(s.url) === targetUrl);

    if (storeIndex === -1) throw new Error('Store no encontrada con esa URL: ' + url);

    if (logo) stores[storeIndex].logo = logo;
    if (image) stores[storeIndex].image = image;
    if (app_password) stores[storeIndex].app_password = app_password;

    try {
      fs.writeFileSync(filePath, JSON.stringify(stores, null, 2));
    } catch (e) {
      console.warn('No se pudo escribir en stores.json:', e.message);
    }
    return stores[storeIndex];
  },

  // Listar stores con iconos dinámicos desde WP
  listStoresWithIcons: async () => {
    const filePath = getStoresFilePath();
    console.log('DEBUG: listStoresWithIcons leyendo de:', filePath);
    
    if (!fs.existsSync(filePath)) {
       console.error('DEBUG: ARCHIVO NO ENCONTRADO en:', filePath);
       return [];
    }

    const storesData = fs.readFileSync(filePath, 'utf-8');
    const stores = JSON.parse(storesData);
    console.log(`DEBUG: Stores cargados del JSON: ${stores.length}`);
    if (stores.length > 0) {
        console.log('DEBUG: Primer store del JSON:', JSON.stringify(stores[0]));
        const batlle = stores.find(s => s.name === 'Batlle');
        if (batlle) console.log('DEBUG: Store Batlle encontrada en JSON:', JSON.stringify(batlle));
    }

    const storesWithIcons = await Promise.all(
      stores.map(async store => {
        let platform_icons = store.platform_icons || [];
        let logo = store.logo || '';
        let image = store.image || '';
        
        // Debug inicial
        if (store.name === 'Batlle') console.log(`DEBUG Batlle antes de WP - Image: ${image}`);

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
                // Priorizar imagen hardcodeada: solo sobrescribir si no hay imagen local
                if (!store.image) {
                    image = wpData[0].image;
                } else {
                    if (store.name === 'Batlle') console.log(`DEBUG Batlle: Manteniendo imagen hardcodeada: ${store.image}`);
                }
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
