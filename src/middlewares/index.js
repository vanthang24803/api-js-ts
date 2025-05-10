module.exports = {
  loggerMiddleware: require("./logging.middleware"),
  corsMiddleware: require("./cors.middleware"),
  responseMiddleware: require("./response.middleware"),
  notFoundMiddleware: require("./response.middleware"),
  handleErrorMiddleware: require("./error.middleware"),
};
