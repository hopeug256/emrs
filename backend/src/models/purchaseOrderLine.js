const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PurchaseOrderLine", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    unitCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    lineTotal: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    }
  });

