const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Payslip", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    slipNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    basicPay: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    allowances: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    deductions: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    netPay: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    paymentStatus: {
      type: DataTypes.ENUM("Pending", "Paid", "OnHold"),
      defaultValue: "Pending"
    },
    paidAt: DataTypes.DATE
  });

