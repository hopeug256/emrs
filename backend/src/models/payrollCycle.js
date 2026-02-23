const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PayrollCycle", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cycleCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    periodStart: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    periodEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Open", "Processed", "Closed"),
      defaultValue: "Open"
    },
    processedAt: DataTypes.DATE
  });

