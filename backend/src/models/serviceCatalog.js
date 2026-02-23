const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ServiceCatalog", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    serviceCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: DataTypes.STRING,
    basePrice: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

