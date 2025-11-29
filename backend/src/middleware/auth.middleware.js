const path = require('path');
const AuthService = require(path.join(__dirname, '..', 'modules', 'auth', 'auth.service'));

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const result = AuthService.verifyToken(token);

    if (!result.valid) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Agregar usuario al request
    req.user = result.decoded;
    next();
  } catch (err) {
    console.error('Error en authMiddleware:', err);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar token'
    });
  }
};

module.exports = authMiddleware;
