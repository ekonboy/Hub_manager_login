const jwt = require('jsonwebtoken');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

const AuthService = {
  // Verificar credenciales
  verifyCredentials: (username, password) => {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    console.log('Login Check:');
    console.log('  - Usuario recibido:', username);
    console.log('  - Usuario esperado (ENV):', adminUsername);
    console.log('  - ¿Password coincide?:', password === adminPassword ? 'SÍ' : 'NO');

    return username === adminUsername && password === adminPassword;
  },

  // Generar token JWT
  generateToken: (username) => {
    const payload = {
      username,
      iat: Date.now()
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  // Verificar token JWT
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return { valid: true, decoded };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  }
};

module.exports = AuthService;
