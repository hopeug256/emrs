const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ClientAccount", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    accountType: {
      type: DataTypes.ENUM("Patient", "Corporate", "Insurance"),
      defaultValue: "Patient"
    },
    creditLimit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    currentBalance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM("Active", "OnHold", "Closed"),
      defaultValue: "Active"
    }
  });
