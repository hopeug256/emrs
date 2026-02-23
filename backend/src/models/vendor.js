const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Vendor", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    vendorCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactPerson: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Active", "Blocked"),
      defaultValue: "Active"
    }
  });

