const cron = require("node-cron");

// cron.schedule("*/5 * * * * *", async () => {
//   const res = await http.get(
//     `https://jsonplaceholder.typicode.com/posts/${_.random(1, 100)}`
//   );

//   const { userId, title } = res;

//   log.info(`${userId} - ${title}`);
// });

log.info("✅ Load cron job successfully!");
