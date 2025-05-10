const { MongoClient } = require("mongodb");

let db = null;

module.exports = {
  connect: async () => {
    if (db) return db;

    const client = await MongoClient.connect(env.MONGODB_URI);
    db = client.db(env.MONGODB_DATABASE);

    global.db = db;
    log.info("✅ Connected to MongoDB");
  },
};
