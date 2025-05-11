/**
 * @description Import configs
 */
require("@/configs");
require("@/common");
require("@/tasks");

/**
 * @description Import express
 */
const express = require("express");

/**
 * @description Import middleware
 */
const {
  loggerMiddleware,
  corsMiddleware,
  responseMiddleware,
  notFoundMiddleware,
  handleErrorMiddleware,
} = require("@/middlewares");

const router = require("@/router");

const app = express();

/**
 * @description Add middleware to the express app
 */
app.use(express.json());
app.use(corsMiddleware);

app.use(responseMiddleware);
app.use(loggerMiddleware);
app.use(router);
app.use(handleErrorMiddleware);
app.use(notFoundMiddleware);

module.exports = app;
