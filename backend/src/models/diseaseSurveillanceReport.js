const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("DiseaseSurveillanceReport", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    caseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    diseaseName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reportType: {
      type: DataTypes.ENUM("Immediate24h", "Weekly"),
      defaultValue: "Immediate24h"
    },
    suspectedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    confirmedAt: DataTypes.DATE,
    deadlineAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reportedAt: DataTypes.DATE,
    timelinessStatus: {
      type: DataTypes.ENUM("Pending", "OnTime", "Late"),
      defaultValue: "Pending"
    },
    facilityCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district: DataTypes.STRING,
    notes: DataTypes.TEXT
  });
