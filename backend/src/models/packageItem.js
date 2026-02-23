const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PackageItem", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 1
    },
    linePrice: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    }
  });

