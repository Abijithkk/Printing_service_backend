const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const env = require("../config/env");

const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return sendSuccess(res, "User logged in successfully", {
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return sendError(res, "Invalid email or password", null, 401);
    }
  } catch (error) {
    return sendError(res, "Server error", { details: error.message }, 500);
  }
};

module.exports = { authUser };
