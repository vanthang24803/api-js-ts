module.exports = (err, req, res, next) => {
  const code = err.code || 500;
  const message = err.message || "Internal Server Error";

  const requestId = req.headers["x-request-id"];

  const method = req.method;
  const path = req.originalUrl;

  const msg = `[${method}] - ${requestId} - ${path} - ${code}  - ${message}`;

  log.error(msg);

  return res.error({
    code,
    message,
  });
};
