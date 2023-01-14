const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "comment",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      bookId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "book",
          key: "id",
        },
      },
      comment: {
        type: DataTypes.STRING(450),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "comment",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "FK_comment_1_idx",
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
        {
          name: "FK_comment_2_idx",
          using: "BTREE",
          fields: [{ name: "bookId" }],
        },
      ],
    }
  );
};
