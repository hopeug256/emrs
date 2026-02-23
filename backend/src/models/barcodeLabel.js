const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("BarcodeLabel", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entityId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    format: {
      type: DataTypes.ENUM("Code128", "QR"),
      defaultValue: "Code128"
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active"
    }
  });

