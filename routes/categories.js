const express = require("express");
const { protect } = require("../middleware/protect");

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

router.route("/").get(getCategories).post(protect, createCategory);

router.route("/:id/photos").put(protect, uploadCategoryPhoto);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
