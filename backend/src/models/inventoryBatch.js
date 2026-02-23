const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("InventoryBatch", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    batchNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    lotNumber: DataTypes.STRING,
    expiryDate: DataTypes.DATEONLY,
    quantityOnHand: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    unitCost: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM("Active", "Expired", "Blocked"),
      defaultValue: "Active"
    }
  });

