const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Surgery", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    surgeryNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    scheduledStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    scheduledEnd: DataTypes.DATE,
    actualStart: DataTypes.DATE,
    actualEnd: DataTypes.DATE,
    priority: {
      type: DataTypes.ENUM("Elective", "Urgent", "Emergency"),
      defaultValue: "Elective"
    },
    status: {
      type: DataTypes.ENUM("Scheduled", "InProgress", "Completed", "Cancelled"),
      defaultValue: "Scheduled"
    },
    notes: DataTypes.TEXT
  });
