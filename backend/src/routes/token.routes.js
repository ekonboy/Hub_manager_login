const express = require('express');
const router = express.Router();
const TokenService = require('../modules/tokens/token.service');

// Crear token
router.post('/create', async (req, res) => {
  const { userId, storeId } = req.body || {};
  if (!userId || !storeId) return res.status(400).json({ message: 'Falta userId o storeId' });

  try {
    const tokenObj = await TokenService.createToken(userId, storeId);
    res.json({ message: 'Token creado', token: tokenObj });
  } catch (err) {
    res.status(500).json({ message: 'Error creando token', error: err.message });
  }
});

// Validar token
router.post('/validate', async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ message: 'Falta token' });

  try {
    const valid = await TokenService.validateToken(token);
    if (!valid.valid) return res.status(401).json({ message: 'Token inválido o expirado' });
    res.json({ message: 'Token válido', token: valid });
  } catch (err) {
    res.status(500).json({ message: 'Error validando token', error: err.message });
  }
});

module.exports = router;
