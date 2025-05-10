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
    await require("@/configs/mongo.config").connection();

    log.info(
      `🚀 Application listening at http://localhost:${process.env.PORT}`
    );

    app.listen(process.env.PORT);
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

startServer();
