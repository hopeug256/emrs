const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Department", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    location: DataTypes.STRING,
    description: DataTypes.TEXT
  });

