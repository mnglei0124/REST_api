const User = require("../models/User");
const MyError = require("../utils/myError");
const path = require("path");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.register = asyncHandler(async (req, res, next) => {
  const user = User.create(req.body);

  res.status(200).json({
    success: true,
    user: req.body,
  });
});
