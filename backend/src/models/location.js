const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Location", {
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
    address: DataTypes.STRING
  });

