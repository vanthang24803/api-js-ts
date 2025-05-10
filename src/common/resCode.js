const moment = require("moment");

const response = {
  OK: { code: 0, message: "OK" },
  INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error" },
  BAD_REQUEST: { code: 400, message: "Bad Request" },
  NOT_FOUND: { code: 404, message: "Not Found" },
  UNAUTHORIZED: { code: 401, message: "Unauthorized" },
  FORBIDDEN: { code: 403, message: "Forbidden" },
  UNPROCESSABLE_ENTITY: { code: 422, message: "Unprocessable Entity" },
  NOT_IMPLEMENTED: { code: 501, message: "Not Implemented" },
  SERVICE_UNAVAILABLE: { code: 503, message: "Service Unavailable" },
  GATEWAY_TIMEOUT: { code: 504, message: "Gateway Timeout" },
  ROOT_PATH: {
    code: 0,
    message: `Hello world at ${moment().format("DD-MM-YYYY HH:mm:ss")}`,
  },
  HEALTH_PATH: { code: 0, message: "Server is healthy" },
};

const codeMap = Object.keys(response).reduce((map, key) => {
  map[response[key].code] = key;
  return map;
}, {});

/**
 *
 * @param {*} input
 * @param {*} mess
 * @returns
 */
const get = (input, mess) => {
  const key = typeof input === "string" ? input : codeMap[input];
  const res = response[key];

  if (!res) {
    return {
      code: input,
      message: mess || "Unknown Error",
    };
  }

  return {
    code: res.code,
    message: mess || res.message,
  };
};

global.resCode = {
  ...response,
  get,
};

module.exports = {
  response,
};
