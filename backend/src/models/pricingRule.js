const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PricingRule", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ruleCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adjustmentType: {
      type: DataTypes.ENUM("Percentage", "Flat"),
      defaultValue: "Percentage"
    },
    adjustmentValue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    applyOn: {
      type: DataTypes.ENUM("Service", "Package", "Invoice"),
      defaultValue: "Service"
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

