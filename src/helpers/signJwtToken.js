const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

async function hashToken(user) {
  const serverKey = await fs.readFileSync(
    path.join(__dirname, '../../server.key'),
  );
  const token = await jwt.sign(
    { user: user, exp: Math.floor(Date.now() / 1000) + 3600 * 24 },
    serverKey,
    { algorithm: 'HS256' },
  );
  return token;
}

module.exports = hashToken;
