const { v7: uuidv7 } = require("uuid");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

module.exports = (req, res, next) => {
  const requestId = req.headers["x-request-id"] || uuidv7();
  req.headers["x-request-id"] = requestId;

  const metadata = {
    version: "1.0.0",
    path: req.originalUrl,
    method: req.method,
    requestId,
    timestamp: new Date(),
    device: req.headers["user-agent"] || "",
  };

  res.locals.metadata = metadata;

  const originalJson = res.json;
  res.setHeader("x-request-id", requestId);

  res.ok = function (body) {
    if (
      res.statusCode === StatusCodes.OK ||
      res.statusCode === StatusCodes.CREATED
    ) {
      body = {
        status: res.statusCode,
        success: true,
        result: body || null,
        metadata: metadata,
      };
    } else {
      body = {
        success: false,
        metadata: metadata,
      };
    }

    return originalJson.call(this, body);
  };

  res.badRequest = function (body) {
    res.status(StatusCodes.BAD_REQUEST);
    return originalJson.call(this, {
      success: false,
      error: body || getReasonPhrase(StatusCodes.BAD_REQUEST),
      metadata: metadata,
    });
  };

  res.notFound = function (body) {
    res.status(StatusCodes.NOT_FOUND);
    return originalJson.call(this, {
      success: false,
      error: body || getReasonPhrase(StatusCodes.NOT_FOUND),
      metadata: metadata,
    });
  };

  res.internalServerError = function (body) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    return originalJson.call(this, {
      success: false,
      error: body || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      metadata: metadata,
    });
  };

  res.unauthorized = function (body) {
    res.status(StatusCodes.UNAUTHORIZED);
    return originalJson.call(this, {
      success: false,
      error: body || getReasonPhrase(StatusCodes.UNAUTHORIZED),
      metadata: metadata,
    });
  };

  res.forbidden = function (body) {
    res.status(StatusCodes.FORBIDDEN);
    return originalJson.call(this, {
      success: false,
      error: body || getReasonPhrase(StatusCodes.FORBIDDEN),
      metadata: metadata,
    });
  };

  res.error = function (body) {
    res.status(body.code || StatusCodes.INTERNAL_SERVER_ERROR);
    return originalJson.call(this, {
      success: false,
      error: body.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      metadata: metadata,
    });
  };

  next();
};
