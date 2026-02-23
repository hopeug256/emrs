const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Bed", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bedNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM("Available", "Occupied", "Reserved", "Cleaning", "Maintenance"),
      defaultValue: "Available"
    }
  });

