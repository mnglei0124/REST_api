const User = require("../models/User");
const MyError = require("../utils/myError");
const path = require("path");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw MyError("Insert email or passowrd correctly!", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw MyError("email or password is incorrect!", 401);
  }

  const ok = await user.checkPassword(password);

  if (!ok) {
    throw MyError("email or password is incorrect!", 401);
  }

  res.status(200).json({
    success: true,
    token: user.getJsonWebToken(),
    user,
  });
});
