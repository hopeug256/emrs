const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PurchaseOrder", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    poNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    orderDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    expectedDate: DataTypes.DATEONLY,
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM("Draft", "Approved", "Ordered", "PartReceived", "Received", "Cancelled"),
      defaultValue: "Draft"
    }
  });

