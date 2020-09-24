
let crypto;
try {
  crypto = require('crypto'); // eslint-disable-line
} catch (err) {
  console.error('crypto support is disabled!'); // eslint-disable-line
}

const api = (secret, algorithm) => {
  const iv = Buffer.alloc(16, 0);

  const encrypt = payload => {
    const key = crypto.scryptSync(secret, 'salt', 24);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let crypted = cipher.update(payload, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return { crypted, salt: key };
  };

  const decrypt = (text, salt) => {
    const decipher = crypto.createDecipheriv(algorithm, salt, iv);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  };

  return { encrypt, decrypt };
};

module.exports = api;
