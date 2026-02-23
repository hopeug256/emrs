const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("RadiologyOrder", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    studyType: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Ordered", "Scheduled", "InProgress", "Reported", "Cancelled"),
      defaultValue: "Ordered"
    },
    findings: DataTypes.TEXT,
    impression: DataTypes.TEXT,
    scheduledAt: DataTypes.DATE
  });

