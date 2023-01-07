const JWT = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const MyError = require("../utils/myError");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw MyError(
      "You have no permission to perform this action! Please login first!",
      401
    );
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    throw MyError("No token!", 400);
  }

  const tokenObj = JWT.verify(token, process.env.JWT_SECRET);

  req.userId = tokenObj.id;
  req.userRole = tokenObj.role;
  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new MyError(
        `You're not authorized! Your role --> [${req.userRole}]`,
        403
      );
    }
    next();
  };
};
