const pino = require("pino");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const env = process.env.NODE_ENV || "development";

let transport;

if (env === "development") {
  transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "mm-dd-yyyy HH:MM:ss",
      ignore: "pid,hostname",
    },
  };
} else {
  const logDir = path.join(__dirname, "../../logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logFile = path.join(
    logDir,
    `log-${moment().format("DD-MM-YYYY")}.json`
  );

  transport = {
    targets: [
      {
        target: "pino/file",
        level: "error",
        options: { destination: logFile },
      },
      {
        target: "pino/file",
        level: "info",
        options: { destination: 1 },
      },
    ],
  };
}

global.log = pino({
  level: env === "development" ? "debug" : "info",
  transport,
});
