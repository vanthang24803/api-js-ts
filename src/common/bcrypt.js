const bcrypt = require("bcrypt");

let bcryptFunc = {};

bcryptFunc.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

bcryptFunc.verifyPassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

global.bcrypt = bcryptFunc;
