// src/modules/tokens/token.service.js
const fs = require('fs');
const path = require('path');

const tokensFile = path.join(__dirname, '..', '..', 'data', 'tokens.json');

class TokenService {
  // Asegura que la carpeta y el JSON existan
  static ensureFile() {
    const dir = path.dirname(tokensFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(tokensFile)) fs.writeFileSync(tokensFile, JSON.stringify([]));
  }

  // Leer tokens
  static readTokens() {
    this.ensureFile();
    try {
      const data = fs.readFileSync(tokensFile, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      fs.writeFileSync(tokensFile, JSON.stringify([]));
      return [];
    }
  }

  // Escribir tokens
  static writeTokens(tokens) {
    this.ensureFile();
    fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2), 'utf-8');
  }

  // Crear token
  static async createToken(userId, storeId) {
    if (!userId || !storeId) throw new Error('userId y storeId son obligatorios');

    const tokens = this.readTokens();
    const token = Math.random().toString(36).substring(2, 12);
    const expires_at = new Date(Date.now() + 3600000).toISOString();

    const tokenObj = { token, user_id: userId, store_id: storeId, expires_at };
    tokens.push(tokenObj);
    this.writeTokens(tokens);

    return tokenObj;
  }

  // Validar token
  static async validateToken(token) {
    if (!token) return { valid: false };
    const tokens = this.readTokens();
    const t = tokens.find(t => t.token === token && new Date(t.expires_at) > new Date());
    return t ? { valid: true, user_id: t.user_id, token: t } : { valid: false };
  }

  // Listar tokens
  static async listTokens() {
    return this.readTokens();
  }

  // Borrar token
  static async deleteToken(token) {
    if (!token) return false;
    const tokens = this.readTokens();
    const filtered = tokens.filter(t => t.token !== token);
    if (filtered.length === tokens.length) return false;
    this.writeTokens(filtered);
    return true;
  }
}

module.exports = TokenService;
