const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Insert a name of the book!"],
      unique: true,
      trim: true,
      maxlength: [
        150,
        "Maximum length of name of the book is 150 characters! ",
      ],
    },
    coverphoto: {
      type: String,
      default: "no-photo.jpg",
    },
    author_name: {
      type: String,
      // required: [true, "Insert an author of the book!"],
      trim: true,
      maxlength: [50, "Maximum length of name of the book is 50 characters! "],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be 1 at minimum"],
      max: [10, "Rating must be 1 at maximum"],
    },
    price: {
      type: Number,
      required: [true, "Insert a price of the book!"],
      min: [500, "Price of the book must be 500 at minimum"],
    },
    totalbalance: Number,
    short_content: {
      type: String,
      trim: true,
      maxlength: [5000, "Length of the content must be 5000 at maximum"],
    },
    week_bestseller: {
      type: Boolean,
      dafault: false,
    },
    available: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BookSchema.virtual("lalar").get(function () {
  let tokens = this.author_name.split(" ");
  if (tokens.length === 1) tokens = this.author_name.split(".");
  if (tokens.length === 2) return tokens[1];
  else return tokens[0];
});

module.exports = mongoose.model("Book", BookSchema);
