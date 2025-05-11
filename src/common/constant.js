const moment = require("moment");

const constant = {
  ROLE: {
    ADMIN: "admin",
    USER: "user",
  },

  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
  },

  JWT: {
    JWT_EXPIRE: moment.duration(7, "days").asSeconds(),
    JWT_REFRESH_EXPIRE: moment.duration(30, "days").asSeconds(),
  },

  KEY: {
    LOGIN_TOKEN: "login_token",
  },
};

global.constant = constant;

module.exports = {
  constant,
};
