module.exports = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const timeMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

    const requestId = req.headers["x-request-id"];

    const method = req.method;
    const path = req.originalUrl;
    const status = res.statusCode;

    const msg = `[${method}] - ${requestId} - ${path} - ${status} - ${timeMs} ms`;

    if (status <= 400) {
      log.info(msg);
    }
  });

  next();
};
