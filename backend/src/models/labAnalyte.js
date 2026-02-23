const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("LabAnalyte", {
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
    unit: DataTypes.STRING,
    referenceMin: DataTypes.DECIMAL(10, 3),
    referenceMax: DataTypes.DECIMAL(10, 3),
    criticalMin: DataTypes.DECIMAL(10, 3),
    criticalMax: DataTypes.DECIMAL(10, 3)
  });

