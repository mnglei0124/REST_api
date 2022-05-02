const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Insert a name of the category!"],
      unique: true,
      trim: true,
      maxlength: [50, "Maximum length of the category is 50 characters! "],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Insert a description of the category!"],
      maxlength: [
        50,
        "Length of the description is 500 characters at maximum! ",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be 1 at minimum"],
      max: [10, "Rating must be 1 at maximum"],
    },
    averagePrice: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CategorySchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});

CategorySchema.pre("remove", async function (next) {
  console.log("removing....");
  await this.model("Book").deleteMany({ category: this._id });
  next();
});

CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  this.averageRating = Math.floor(Math.random() * 10) + 1;
  this.averagePrice = Math.floor(Math.random() * 100000) + 3000;
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
