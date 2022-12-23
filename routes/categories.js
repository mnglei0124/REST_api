const express = require("express");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryPhoto,
} = require("../controller/categories");

const { getCategoryBooks } = require("../controller/books");

const router = express.Router();
router.route("/:categoryId/books").get(getCategoryBooks);

router.route("/").get(getCategories).post(createCategory);

router.route("/:id/photos").put(uploadCategoryPhoto);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
