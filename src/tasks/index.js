const moment = require("moment");
const cron = require("node-cron");

cron.schedule("*/5 * * * * *", async () => {
  const res = await http.get(
    `https://jsonplaceholder.typicode.com/posts/${_.random(1, 100)}`
  );
  log.info(res);
});

log.info("✅ Load cron job successfully!");
