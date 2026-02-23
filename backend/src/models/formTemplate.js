const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("FormTemplate", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM("Draft", "Published", "Archived"),
      defaultValue: "Draft"
    }
  });

