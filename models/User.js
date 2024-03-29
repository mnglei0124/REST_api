const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const { nextTick } = require("process");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Insert user info!"],
  },
  email: {
    type: String,
    required: [true, "Insert an email!"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Wrong email!"],
  },
  role: {
    type: String,
    required: [true, "Insert user role!"],
    enum: ["user", "operator", "admin"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 4,
    required: true,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  console.time("salt");
  const salt = await bcrypt.genSalt(10);
  console.timeEnd("salt");

  console.time("hash");
  this.password = await bcrypt.hash(this.password, salt);
  console.timeEnd("hash");
});

UserSchema.methods.getJsonWebToken = function () {
  const token = JWT.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );
  return token;
};

UserSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generatePasswordChangeToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
