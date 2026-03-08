const { sendError } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return sendError(
    res,
    err.message || "Server error",
    { details: err.message },
    statusCode,
  );
};

module.exports = errorHandler;
