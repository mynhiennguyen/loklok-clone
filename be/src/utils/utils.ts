const crypto = require('crypto');

export const uuid = () => {

  return crypto.randomBytes(16).toString("hex");
}