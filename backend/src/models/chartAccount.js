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
    accountClass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    normalBalance: {
      type: DataTypes.ENUM("Debit", "Credit"),
      allowNull: false,
      defaultValue: "Debit"
    },
    parentAccountId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    isPostingAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
