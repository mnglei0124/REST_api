var DataTypes = require("sequelize").DataTypes;
var _book = require("./book");
var _course = require("./course");
var _teacher = require("./teacher");
var _user = require("./user");

function initModels(sequelize) {
  var book = _book(sequelize, DataTypes);
  var course = _course(sequelize, DataTypes);
  var teacher = _teacher(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  book.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(book, { as: "books", foreignKey: "user_id"});

  return {
    book,
    course,
    teacher,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
