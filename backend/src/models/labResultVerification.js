const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("LabResultVerification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    step: {
      type: DataTypes.ENUM("Technical", "Pathologist", "Final"),
      allowNull: false
    },
    decision: {
      type: DataTypes.ENUM("Approved", "Rejected"),
      allowNull: false
    },
    remarks: DataTypes.TEXT,
    decidedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

