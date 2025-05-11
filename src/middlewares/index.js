module.exports = {
  loggerMiddleware: require("./logging.middleware"),
  corsMiddleware: require("./cors.middleware"),
  responseMiddleware: require("./response.middleware"),
  notFoundMiddleware: require("./notfound.middleware"),
  handleErrorMiddleware: require("./error.middleware"),
};
