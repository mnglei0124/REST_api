const Book = require("../models/Book");
const Category = require("../models/Category");
const User = require("../models/User");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

// api/v1/books
exports.getBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "limit", "page"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Book);
  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

exports.getUserBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "limit", "page"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Book);

  req.query.createUser = req.userId;

  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

exports.getCategoryBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "limit", "page"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Book);

  const books = await Book.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

// api/v1/books/:catId/books
exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(
      "couldn't find the book with ID --> " + req.params.id,
      404
    );
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.createBook = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category).populate("books");
  if (!category) {
    throw new MyError(
      `category with ID -> ${req.body.category} is not found!`,
      400
    );
  }

  req.body.createUser = req.userId;

  const book = await Book.create(req.body);

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(
      "couldn't find the book with ID --> " + req.params.id,
      404
    );
  }

  if (book.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("You can only edit your books!", 403);
  }

  const user = await User.findById(req.userId);

  book.remove();

  res.status(200).json({
    success: true,
    data: book,
    whoDeleted: user.name,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(`book with ID -> ${req.params.id} is not found!`, 400);
  }

  if (book.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("You can only edit your books!", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    book[attr] = req.body[attr];
  }
  // const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  book.save();

  res.status(200).json({ success: true, data: book });
});

// api/v1/books/:id/photo
exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(`book with ID -> ${req.params.id} is not found!`, 400);
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

    book.photo = file.name;
    book.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
