const app = require("./bootstrap");
/**
 * Starts the application server.
 *
 * @function startServer
 * @returns {Promise<void>}
 * @throws {Error} If there is an error starting the server.
 */
async function startServer() {
  try {
    await require("@/configs/mongo.config").connect();
    // await require("@/configs/redis.config").connect();

    log.info(`🚀 Application listening at http://localhost:${env.PORT}`);

    app.listen(env.PORT);
  } catch (error) {
    log.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

startServer();
