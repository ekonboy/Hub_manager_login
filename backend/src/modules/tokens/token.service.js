const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const tokensFile = path.join(__dirname, '..', '..', 'data', 'tokens.json');

class TokenService {
  constructor() {
    this.ensureFile();
  }

  // Asegura que la carpeta y el JSON existan
  ensureFile() {
    const dir = path.dirname(tokensFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(tokensFile)) fs.writeFileSync(tokensFile, JSON.stringify([]));
  }

  // Función auxiliar para leer los tokens
  readTokens() {
    this.ensureFile();
    try {
      const data = fs.readFileSync(tokensFile, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      return [];
    }
  }

  // Función auxiliar para guardar los tokens
  saveTokens(tokens) {
    this.ensureFile();
    fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2));
  }

  // Crear un token nuevo para un usuario y tienda
  async createToken(userId, storeId, expiresInMinutes = 60) {
    const tokens = this.readTokens();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000).toISOString();

    const tokenObj = { token, userId, storeId, expiresAt };
    tokens.push(tokenObj);
    this.saveTokens(tokens);

    return tokenObj;
  }

  // Validar un token
  async validateToken(token) {
    const tokens = this.readTokens();
    const found = tokens.find(
      t => t.token === token && new Date(t.expiresAt) > new Date()
    );
    // Return format expected by routes: { valid: true, ... } or { valid: false }
    // The route checks: if (!valid.valid) ...
    if (found) {
        return { valid: true, ...found };
    }
    return { valid: false };
  }

  // Listar tokens
  async listTokens(filters = {}) {
    let tokens = this.readTokens();

    if (filters.expired) {
        const isExpired = String(filters.expired) === 'true';
        const now = new Date();
        tokens = tokens.filter(t => {
            const exp = new Date(t.expiresAt);
            return isExpired ? exp <= now : exp > now;
        });
    }

    return tokens;
  }

  // Eliminar un token (logout o refresco)
  async deleteToken(token) {
    let tokens = this.readTokens();
    const initialLength = tokens.length;
    tokens = tokens.filter(t => t.token !== token);
    
    if (tokens.length !== initialLength) {
        this.saveTokens(tokens);
        return true;
    }
    return false;
  }
}

module.exports = new TokenService();
