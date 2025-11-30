const express = require('express');
const router = express.Router();
const path = require('path');

const StoreController = require(path.join(__dirname, '..', 'modules', 'stores', 'store.controller'));

// GET /api/stores
router.get('/', StoreController.listStores);

// POST /api/stores
router.post('/', StoreController.createStore);

// GET /api/stores/:id/login?user_id=1
router.get('/:id/login', StoreController.loginStore);

// PUT /api/stores/sync
router.put('/sync', StoreController.syncStore);


module.exports = router;
