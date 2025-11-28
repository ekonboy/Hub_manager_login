const path = require('path');
const StoreService = require(path.join(__dirname, 'store.service'));
const response = require(path.join(__dirname, '..', '..', 'utils', 'response'));

const StoreController = {
    listStores: async (req, res) => {
        try {
            const stores = await StoreService.listStores();
            response.success(res, { stores });
        } catch(err) {
            response.error(res, err.message);
        }
    },

    createStore: async (req, res) => {
        try {
            const store = await StoreService.createStore(req.body);
            response.success(res, store, 'Store creada');
        } catch(err) {
            response.error(res, err.message);
        }
    },

    loginStore: async (req, res) => {
        try {
            const storeId = parseInt(req.params.id);
            const userId = parseInt(req.query.user_id || 1);

            console.log('--- loginStore click ---');
            console.log('Store ID:', storeId);
            console.log('User ID:', userId);

            const url = await StoreService.generateTokenAndSend(storeId, userId);

            console.log('Login URL generado:', url);
            console.log('-----------------------');

            response.success(res, { login_url: url }, 'Login URL generado');
        } catch(err) {
            console.error('Error en loginStore:', err);
            response.error(res, err.message);
        }
    },

    syncStore: async (req, res) => {
        try {
            console.log('--- syncStore request ---');
            console.log('Body:', req.body);
            const updatedStore = await StoreService.syncStore(req.body);
            response.success(res, updatedStore, 'Store actualizada correctamente');
        } catch(err) {
            console.error('Error en syncStore:', err);
            response.error(res, err.message);
        }
    }
};



module.exports = StoreController;
