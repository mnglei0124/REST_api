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

  user.resetPasswordToken = user.generatePasswordChangeToken();
  user.save();
  //send an email

  res.status(200).json({ success: true, data: user.resetPasswordToken });
});
