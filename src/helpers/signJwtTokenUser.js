const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

async function hashToken(userInfo) {
  const serverKey = await fs.readFileSync(
    path.join(__dirname, '../../server.key'),
  );
  const token = await jwt.sign(
    { userInfo: userInfo, exp: Date.now() + 3600 * 1000 },
    serverKey,
    { algorithm: 'RS256' },
    { expiresIn: Date.now() + 3600 * 1000 },
  );
  return token;
}

module.exports = hashToken;
