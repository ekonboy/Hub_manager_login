const StoreService = require('./store.service');
const axios = require('axios');

class StoreController {

  async listStores(req, res) {
    const stores = StoreService.listStores();
    res.json({ stores });
  }

  async createStore(req, res) {
    const { name, url, platform, username, app_password } = req.body;
    const store = StoreService.createStore({ name, url, platform, username, app_password });
    res.json({ store });
  }

  // Login automático
  async loginStore(req, res) {
    const storeId = req.params.id;
    const store = StoreService.getStoreById(storeId);
    if (!store) return res.status(404).json({ message: 'Store no encontrada' });

    try {
      if (store.platform === 'wp') {
        // Llamada al plugin WP Hub Login
        const response = await axios.get(`${store.url}/wp-json/filament/v1/login?token=${token}`, {
          username: store.username,
          app_password: store.app_password
        }, { withCredentials: true });

        // Retornamos URL de login para redirigir al front
        return res.json({
          message: 'Login exitoso',
          login_url: store.url
        });
      }

      // Más CMS en el futuro
      return res.status(400).json({ message: 'CMS no soportado aún' });

    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error logueando en el CMS', error: err.message });
    }
  }
}

module.exports = new StoreController();
