const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

class TokenService {
  // Crear un token JWT para un usuario y tienda
  async createToken(userId, storeId, email, expiresInMinutes = 60) {
    const payload = {
      userId,
      storeId,
      email,
      iat: Math.floor(Date.now() / 1000), // issued at
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: `${expiresInMinutes}m`,
    });

    return {
      token,
      userId,
      storeId,
      email,
      expiresAt: new Date(Date.now() + expiresInMinutes * 60000).toISOString(),
    };
  }

  // Validar un token JWT
  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return {
        valid: true,
        token,
        userId: decoded.userId,
        storeId: decoded.storeId,
        email: decoded.email,
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
      };
    } catch (err) {
      // Token inválido o expirado
      return { valid: false };
    }
  }

  // Listar tokens - No aplicable con JWT (stateless)
  async listTokens(filters = {}) {
    throw new Error('listTokens no está disponible con JWT tokens');
  }

  // Eliminar un token - No aplicable con JWT (stateless)
  async deleteToken(token) {
    throw new Error('deleteToken no está disponible con JWT tokens');
  }
}

module.exports = new TokenService();
