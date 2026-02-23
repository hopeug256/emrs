const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("AssessmentNote", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    noteNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    assessmentType: DataTypes.STRING,
    findings: DataTypes.TEXT,
    diagnosis: DataTypes.STRING,
    plan: DataTypes.TEXT
  });

