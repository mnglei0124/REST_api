const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const Category = require("./models/Category");
const Book = require("./models/Book");
const User = require("./models/User");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGODB_URI);

const categories = JSON.parse(
  fs.readFileSync(__dirname + "/data/categories.json", "utf-8")
);

const books = JSON.parse(
  fs.readFileSync(__dirname + "/data/book.json", "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(__dirname + "/data/user.json", "utf-8")
);

const importData = async () => {
  try {
    await Category.create(categories);
    await Book.create(books);
    await User.create(users);
    console.log("import done".inverse);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Category.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();
    console.log("delete done".cyan);
  } catch (err) {
    console.log(err.red.inverse);
  }
};

const backupData = async () => {
  try {
    await Category.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();
    await Category.create(categories);
    await Book.create(books);
    await User.create(users);
    console.log("backup done".cyan.inverse);
  } catch (err) {
    console.log(err.red);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else if (process.argv[2] === "--backup") {
  backupData();
}
