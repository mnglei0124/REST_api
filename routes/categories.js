const express = require("express");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryPhoto,
} = require("../controller/categories");

//const { getBooks } = require("../controller/books");

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);

router.route("/:id/photos").put(uploadCategoryPhoto);

// router.route("/:categoryId/books").get(getBooks);
const booksRouter = require("./books");
router.use("/:categoryId/books", booksRouter);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
