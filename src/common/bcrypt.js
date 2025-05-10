const bcrypt = require("bcrypt");

let bcryptFunc = {};

/**
 *
 * @param {*} password
 * @returns
 */
bcryptFunc.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 *
 * @param {*} password
 * @param {*} hashPassword
 * @returns
 */
bcryptFunc.verifyPassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

global.bcrypt = bcryptFunc;
