const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("RadiologyModality", {
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
    location: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Available", "Busy", "Maintenance"),
      defaultValue: "Available"
    }
  });

