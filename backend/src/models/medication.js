const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Medication", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genericName: DataTypes.STRING,
    form: DataTypes.STRING,
    strength: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  });

