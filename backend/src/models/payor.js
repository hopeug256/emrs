const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Payor", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("Insurance", "Corporate", "Government", "SelfPay"),
      defaultValue: "Insurance"
    },
    contactName: DataTypes.STRING,
    contactPhone: DataTypes.STRING,
    contactEmail: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active"
    }
  });

