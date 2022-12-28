const express = require("express");

const { register } = require("../controller/users");

const router = express.Router();

router.route("/").post(register);

module.exports = router;
