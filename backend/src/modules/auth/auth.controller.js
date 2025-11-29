const path = require('path');
const AuthService = require(path.join(__dirname, 'auth.service'));
const response = require(path.join(__dirname, '..', '..', 'utils', 'response'));

const AuthController = {
  // POST /api/auth/login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return response.error(res, 'Usuario y contraseña son requeridos', 400);
      }

      const isValid = AuthService.verifyCredentials(username, password);

      if (!isValid) {
        return response.error(res, 'Credenciales inválidas', 401);
      }

      const token = AuthService.generateToken(username);

      response.success(res, { token, username }, 'Login exitoso');
    } catch (err) {
      console.error('Error en login:', err);
      response.error(res, err.message, 500);
    }
  },

  // POST /api/auth/verify
  verify: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return response.error(res, 'Token es requerido', 400);
      }

      const result = AuthService.verifyToken(token);

      if (!result.valid) {
        return response.error(res, 'Token inválido o expirado', 401);
      }

      response.success(res, { valid: true, user: result.decoded }, 'Token válido');
    } catch (err) {
      console.error('Error en verify:', err);
      response.error(res, err.message, 500);
    }
  }
};

module.exports = AuthController;
