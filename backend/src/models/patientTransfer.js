const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PatientTransfer", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    transferNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    transferType: {
      type: DataTypes.ENUM("WardToWard", "FacilityToFacility"),
      defaultValue: "WardToWard"
    },
    reason: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("Requested", "Approved", "Completed", "Cancelled"),
      defaultValue: "Requested"
    },
    transferredAt: DataTypes.DATE
  });

