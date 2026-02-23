const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ChatThread", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    threadNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: DataTypes.STRING,
    threadType: {
      type: DataTypes.ENUM("Direct", "Group", "Case"),
      defaultValue: "Direct"
    },
    status: {
      type: DataTypes.ENUM("Active", "Archived"),
      defaultValue: "Active"
    }
  });
