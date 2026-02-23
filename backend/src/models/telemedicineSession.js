const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("TelemedicineSession", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sessionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    scheduledAt: DataTypes.DATE,
    meetingUrl: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Scheduled", "InProgress", "Completed", "Cancelled"),
      defaultValue: "Scheduled"
    },
    notes: DataTypes.TEXT
  });

