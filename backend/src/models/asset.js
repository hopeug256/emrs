const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Asset", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    assetTag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: DataTypes.STRING,
    location: DataTypes.STRING,
    purchaseDate: DataTypes.DATEONLY,
    nextMaintenanceDate: DataTypes.DATEONLY,
    status: {
      type: DataTypes.ENUM("Active", "Maintenance", "Retired"),
      defaultValue: "Active"
    }
  });
