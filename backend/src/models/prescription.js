const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Prescription", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    dosage: DataTypes.STRING,
    frequency: DataTypes.STRING,
    durationDays: DataTypes.INTEGER,
    instructions: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("Active", "Completed", "Cancelled"),
      defaultValue: "Active"
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  });

