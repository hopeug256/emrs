const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ChartAccount", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    accountCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountType: {
      type: DataTypes.ENUM("Asset", "Liability", "Equity", "Revenue", "Expense"),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

