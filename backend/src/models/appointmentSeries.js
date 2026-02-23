const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("AppointmentSeries", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    seriesNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    frequency: {
      type: DataTypes.ENUM("Daily", "Weekly", "Monthly"),
      defaultValue: "Weekly"
    },
    intervalValue: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    occurrences: {
      type: DataTypes.INTEGER,
      defaultValue: 4
    },
    status: {
      type: DataTypes.ENUM("Active", "Completed", "Cancelled"),
      defaultValue: "Active"
    }
  });

