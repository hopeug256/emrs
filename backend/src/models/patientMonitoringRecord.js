const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PatientMonitoringRecord", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    recordNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    monitoredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    heartRate: DataTypes.INTEGER,
    respiratoryRate: DataTypes.INTEGER,
    temperatureC: DataTypes.DECIMAL(4, 1),
    systolicBp: DataTypes.INTEGER,
    diastolicBp: DataTypes.INTEGER,
    spo2Percent: DataTypes.INTEGER,
    painScore: DataTypes.INTEGER,
    alertLevel: {
      type: DataTypes.ENUM("Normal", "Warning", "Critical"),
      defaultValue: "Normal"
    },
    notes: DataTypes.TEXT
  });
