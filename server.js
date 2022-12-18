const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const rfs = require("rotating-file-stream");
const colors = require("colors");
const fileupload = require("express-fileupload");

const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

dotenv.config({ path: "./config/config.env" });
connectDB();

var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

const app = express();

app.use(express.json());
app.use(fileupload());
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  console.log(`server started at PORT: ${process.env.PORT}`.cyan.bold)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`aldaa baina daa... ${err.message}`.red);
  server.close(() => {
    process.exit(1);
  });
});
