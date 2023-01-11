const User = require("../models/User");
const MyError = require("../utils/myError");
const path = require("path");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

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
    throw new MyError("Insert email or passowrd correctly!", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new MyError("email or password is incorrect!", 401);
  }

  const ok = await user.checkPassword(password);

  if (!ok) {
    throw new MyError("email or password is incorrect!", 401);
  }

  res.status(200).json({
    success: true,
    token: user.getJsonWebToken(),
    user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "limit", "page"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, User);

  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: users,
    pagination,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new MyError(`user with ID -> ${req.params.id} is not found!`, 400);
  }

  res.status(200).json({ success: true, data: user });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({ success: true, data: user });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new MyError(`user with ID -> ${req.params.id} is not found!`, 400);
  }
  res.status(200).json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new MyError(`user with ID -> ${req.params.id} is not found!`, 400);
  }

  user.remove();

  res.status(200).json({ success: true, data: user });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    throw new MyError("Insert an email!", 400);
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new MyError(
      `user with email -> ${req.body.email} is not found!`,
      400
    );
  }

  const resetToken = user.generatePasswordChangeToken();
  await user.save();

  //send an email
  const link = `https://mnglei.mn/changepassword/${resetToken}`;

  const message = `Click the link below to change your password!<br><br><a target="_blanks" href="${link}">Eniig dar psda min</a>
  `;
  const info = await sendEmail({
    email: user.email,
    subject: "Password change!",
    message,
  });
  console.log("Message sent: %s", info.messageId);

  res.status(200).json({ success: true, resetToken, message });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.resetToken || !req.body.password) {
    throw new MyError("Please insert token and password", 400);
  }

  const encrypted = crypto
    .createHash("sha256")
    .update(req.body.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: encrypted,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new MyError(`Token is expired!`, 400);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = user.getJsonWebToken();

  res.status(200).json({ success: true, token, user: user });
});
