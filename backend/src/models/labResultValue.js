const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("LabResultValue", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    valueText: DataTypes.STRING,
    valueNumeric: DataTypes.DECIMAL(12, 4),
    unit: DataTypes.STRING,
    referenceMin: DataTypes.DECIMAL(12, 4),
    referenceMax: DataTypes.DECIMAL(12, 4),
    flag: {
      type: DataTypes.ENUM("Normal", "Low", "High", "CriticalLow", "CriticalHigh", "Invalid"),
      defaultValue: "Normal"
    }
  });

