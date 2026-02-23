const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("IntakeFormSubmission", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    submissionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    chiefComplaint: DataTypes.TEXT,
    triageCategory: {
      type: DataTypes.ENUM("Routine", "Urgent", "Emergency"),
      defaultValue: "Routine"
    },
    vitalsJson: DataTypes.TEXT,
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

