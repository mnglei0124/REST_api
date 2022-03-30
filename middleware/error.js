const colors = require("colors");

const errorHandler = (err, req, res, next) => {
  const error = { ...err };

  if (error.name === "CastError") {
    error.message = "ID has a wrong structure";
    error.statusCode = 400;
  }

  if (error.code === 11000) {
    error.message = "Values of this field must be unique!";
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error,
  });
};

module.exports = errorHandler;
