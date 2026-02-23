const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("CompoundRecord", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    compoundNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    formulaName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantityProduced: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    notes: DataTypes.TEXT
  });

