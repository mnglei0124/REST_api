const Category = require("../models/Category");
const MyError = require("../utils/myError");
const path = require("path");
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

// api/v1/category/:id/photo
exports.uploadCategoryPhoto = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new MyError(
      `category with ID -> ${req.params.id} is not found!`,
      400
    );
  }

  // image upload
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Insert an image file!", 400);
  }
  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    throw new MyError("Image size exceeded!", 400);
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLAOD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Error while uploading the file! Error: " + err.message,
        400
      );
    }

    category.photo = file.name;
    category.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
