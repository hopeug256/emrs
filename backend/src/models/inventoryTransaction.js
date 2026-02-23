const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("InventoryTransaction", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    transactionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    transactionType: {
      type: DataTypes.ENUM("Receipt", "Issue", "Adjustment", "Transfer"),
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    unitCost: DataTypes.DECIMAL(12, 2),
    reason: DataTypes.STRING,
    transactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

