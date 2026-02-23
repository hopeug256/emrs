const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Invoice", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Pending", "Paid", "Overdue", "Cancelled"),
      defaultValue: "Pending"
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dueDate: DataTypes.DATE,
    paidAt: DataTypes.DATE,
    notes: DataTypes.TEXT
  });
