const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Payment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    paymentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    method: {
      type: DataTypes.ENUM("Cash", "Card", "MobileMoney", "BankTransfer", "Insurance"),
      defaultValue: "Cash"
    },
    status: {
      type: DataTypes.ENUM("Pending", "Completed", "Failed", "Refunded"),
      defaultValue: "Completed"
    },
    paidAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    reference: DataTypes.STRING
  });

