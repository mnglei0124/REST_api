const Category = require("../models/Category");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;

  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "limit", "page"].forEach((el) => delete req.query[el]);

  const total = await Category.countDocuments();
  const pageCount = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  let end = start + limit - 1;
  end = end > total ? total : end;
  const pagination = { total, pageCount, start, end, limit };
  if (page < pageCount) pagination.nextPage = page + 1;
  if (page > 1) pagination.previousPage = page - 1;
  const categories = await Category.find(req.query, select)
    .sort(sort)
    .skip(start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: categories,
    pagination,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate("books");
  if (!category) {
    throw new MyError(
      `category with ID -> ${req.params.id} is not found!`,
      400
    );
  }
  res.status(200).json({ success: true, data: category });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  console.log(`post request irlee... ${req.body}`);

  const category = await Category.create(req.body);
  res.status(200).json({ success: true, data: category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new MyError(
      `category with ID -> ${req.params.id} is not found!`,
      400
    );
  }
  res.status(200).json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new MyError(
      `category with ID -> ${req.params.id} is not found!`,
      400
    );
  }

  category.remove();

  res.status(200).json({ success: true, data: category });
});
