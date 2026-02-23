const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Budget", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    budgetCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    budgetName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fiscalYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    versionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM("Draft", "Approved", "Locked"),
      allowNull: false,
      defaultValue: "Draft"
    },
    totalAmount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    },
    notes: DataTypes.TEXT
  });
