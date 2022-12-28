const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    enum: ["user", "operator"],
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

UserSchema.pre("save", async function () {
  console.time("salt");
  const salt = await bcrypt.genSalt(10);
  console.timeEnd("salt");

  console.time("hash");
  this.password = await bcrypt.hash(this.password, salt);
  console.timeEnd("hash");
});

module.exports = mongoose.model("User", UserSchema);
