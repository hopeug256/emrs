const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("SurgeryPreOpChecklist", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    consentSigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    npoConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    allergiesReviewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    siteMarked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    anesthesiaAssessmentCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    bloodAvailabilityConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    equipmentCheckCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    remarks: DataTypes.TEXT,
    completedAt: DataTypes.DATE
  });

