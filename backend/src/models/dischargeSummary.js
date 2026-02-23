const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("DischargeSummary", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    dischargeNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    dischargeDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    finalDiagnosis: DataTypes.TEXT,
    treatmentSummary: DataTypes.TEXT,
    followUpInstructions: DataTypes.TEXT
  });

