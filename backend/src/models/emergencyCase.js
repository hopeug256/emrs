const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("EmergencyCase", {
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
    arrivalAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    triageLevel: {
      type: DataTypes.ENUM("Red", "Orange", "Yellow", "Green", "Black"),
      defaultValue: "Yellow"
    },
    chiefComplaint: DataTypes.STRING,
    modeOfArrival: DataTypes.STRING,
    triagedAt: DataTypes.DATE,
    providerSeenAt: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("Triage", "UnderTreatment", "Stabilized", "Admitted", "Discharged", "Referred"),
      defaultValue: "Triage"
    },
    disposition: DataTypes.STRING,
    dispositionAt: DataTypes.DATE
  });
