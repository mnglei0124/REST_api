const express = require("express");
const { protect, authorize } = require("../middleware/protect");

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

router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("admin"), createCategory);

router
  .route("/:id/photos")
  .put(protect, authorize("admin", "operator"), uploadCategoryPhoto);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin", "operator"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

module.exports = router;
