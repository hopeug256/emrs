const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("CalendarEvent", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    eventNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    eventType: {
      type: DataTypes.ENUM("Appointment", "Surgery", "Telemedicine", "General"),
      defaultValue: "General"
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endAt: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("Scheduled", "Completed", "Cancelled"),
      defaultValue: "Scheduled"
    },
    notes: DataTypes.TEXT
  });
