const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const { createComment } = require("../controller/comments");

router
  .route("/")
  .post(protect, authorize("admin", "operator", "user"), createComment);

module.exports = router;
