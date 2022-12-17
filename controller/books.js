const Book = require("../models/Book");
const Category = require("../models/Category");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

// api/v1/books
// api/v1/books/:catId/books
exports.getBooks = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.categoryId) {
    query = Book.find({ category: req.params.categoryId });
  } else {
    query = Book.find().populate({
      path: "category",
      select: "name averagePrice",
    });
  }

  const books = await query;

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(
      "couldn't find the book with ID --> " + req.params.id,
      404
    );
  }
  const avg = await Book.computeCategoryAveragePrice(book.category);
  res.status(200).json({
    success: true,
    data: book,
    dundaj: avg,
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
  book.remove();
  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    throw new MyError(`book with ID -> ${req.params.id} is not found!`, 400);
  }
  res.status(200).json({ success: true, data: book });
});
