const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ProgressNote", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    noteNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    subjective: DataTypes.TEXT,
    objective: DataTypes.TEXT,
    assessment: DataTypes.TEXT,
    plan: DataTypes.TEXT
  });

