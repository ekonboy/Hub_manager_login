const fs = require('fs');
const path = require('path');
const tokensFile = path.join(__dirname, '../../data/tokens.json');

const readJson = () => JSON.parse(fs.readFileSync(tokensFile, 'utf8'));
const writeJson = (data) => fs.writeFileSync(tokensFile, JSON.stringify(data, null, 2));

const Token = {
    create: (data) => {
        const tokens = readJson();
        tokens.push(data);
        writeJson(tokens);
        return data;
    },
    findValid: (token) => {
        const now = new Date();
        return readJson().find(t => t.token === token && new Date(t.expires_at) > now);
    }
};

module.exports = Token;
