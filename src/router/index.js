const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router({
  mergeParams: true,
  caseSensitive: false,
  strict: false,
});

const routeDir = __dirname;

fs.readdirSync(routeDir).forEach((file) => {
  if (file === "index.js") return;

  if (file.endsWith(".route.js")) {
    const route = require(path.join(routeDir, file));
    const routeName = file.replace(".route.js", "");
    router.use(`/api/v${env.VERSIONS}/${routeName}`, route);
  }
});

router.get("/", (req, res) => {
  res.ok(resCode.ROOT_PATH);
});

router.get("/health", (req, res) => {
  res.ok(resCode.HEALTH_PATH);
});

module.exports = router;
