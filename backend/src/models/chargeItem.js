const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ChargeItem", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    chargeNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 1
    },
    unitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    discountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM("Draft", "Posted", "Cancelled"),
      defaultValue: "Draft"
    }
  });

