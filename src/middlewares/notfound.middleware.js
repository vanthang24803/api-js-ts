module.exports = async (req, res, next) => {
  const requestId = req.headers["x-request-id"];

  const method = req.method;
  const path = req.originalUrl;

  res.notFound(`[${method}] - ${requestId} - ${path} not found!`);
};
