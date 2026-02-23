const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ServicePackage", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    packageCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    packagePrice: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

