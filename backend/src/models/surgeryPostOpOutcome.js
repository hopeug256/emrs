const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("SurgeryPostOpOutcome", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    outcomeStatus: {
      type: DataTypes.ENUM("Stable", "Critical", "Transferred", "Deceased"),
      defaultValue: "Stable"
    },
    postOpDiagnosis: DataTypes.STRING,
    disposition: {
      type: DataTypes.ENUM("Ward", "ICU", "Discharged", "Morgue"),
      defaultValue: "Ward"
    },
    painScore: DataTypes.INTEGER,
    followUpPlan: DataTypes.TEXT,
    dischargeInstructions: DataTypes.TEXT,
    recordedAt: DataTypes.DATE
  });
