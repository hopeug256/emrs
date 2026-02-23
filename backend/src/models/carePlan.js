const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("CarePlan", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    goal: {
      type: DataTypes.STRING,
      allowNull: false
    },
    interventions: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("Active", "Completed", "Cancelled"),
      defaultValue: "Active"
    }
  });

