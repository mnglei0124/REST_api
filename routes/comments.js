const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} = require("../controller/comments");

router
  .route("/")
  .get(getComments)
  .post(protect, authorize("admin", "operator", "user"), createComment);

router
  .route("/:id")
  .get(getComment)
  .put(protect, authorize("admin", "operator", "user"), updateComment)
  .delete(protect, authorize("admin", "operator", "user"), deleteComment);

module.exports = router;
