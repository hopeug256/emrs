const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("StockItem", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: DataTypes.STRING,
    unit: DataTypes.STRING,
    reorderLevel: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    isCompoundingIngredient: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

