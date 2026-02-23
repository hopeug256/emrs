const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("EmployeePerformanceMetric", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    metricCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    metricName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    score: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0
    },
    periodStart: DataTypes.DATEONLY,
    periodEnd: DataTypes.DATEONLY,
    notes: DataTypes.TEXT
  });

