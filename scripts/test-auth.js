const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

const hash = hashPassword('Admin@Balochistan2026!');
console.log('Generated hash:', hash);
console.log('Verify correct password:', verifyPassword('Admin@Balochistan2026!', hash));
console.log('Verify wrong password:', verifyPassword('WrongPassword', hash));
