const { getReasonPhrase } = require("http-status-codes");

class Exception extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const newException = (code = 400, message) => {
  throw new Exception(message || getReasonPhrase(code), code);
};

global.exception = newException;
