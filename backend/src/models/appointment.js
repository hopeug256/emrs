const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Appointment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reason: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Scheduled", "CheckedIn", "Completed", "Cancelled", "NoShow"),
      defaultValue: "Scheduled"
    },
    notes: DataTypes.TEXT
  });
