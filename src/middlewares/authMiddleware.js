const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/apiResponse");
const env = require("../config/env");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      return sendError(res, "Not authorized, token failed", null, 401);
    }
  }

  if (!token) {
    return sendError(res, "Not authorized, no token", null, 401);
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return sendError(res, "Not authorized as an admin", null, 403);
  }
};

module.exports = { protect, admin };
