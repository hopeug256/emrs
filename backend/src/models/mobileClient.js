const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("MobileClient", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    platform: {
      type: DataTypes.ENUM("Android", "iOS", "Web"),
      defaultValue: "Android"
    },
    minSdkVersion: {
      type: DataTypes.STRING,
      defaultValue: "1.0.0"
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active"
    }
  });

