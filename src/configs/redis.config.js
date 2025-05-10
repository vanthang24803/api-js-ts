const { Redis } = require("ioredis");

let redisFunc = null;

module.exports = {
  connect: async function () {
    if (redisFunc) return redisFunc;

    redisFunc = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      db: env.REDIS_DB,
    });

    redisFunc.setValue = async function (key, value) {
      return this.set(key, value, "EX", 60 * 60 * 24);
    };

    redisFunc.clear = async function () {
      return this.flushdb();
    };

    redisFunc.on("error", (err) => {
      log.error(`❌ Failed to connect to redis ${err.message}`);
      process.exit(1);
    });

    const ping = await redisFunc.ping();
    if (ping !== "PONG") {
      log.error("❌ Failed to connect to redis");
      process.exit(1);
    }
    global.redis = redisFunc;
    log.info("✅ Connected to Redis");
  },
};
