const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("SurgeryIntraOpNote", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    anesthesiaType: DataTypes.STRING,
    procedureDetails: DataTypes.TEXT,
    estimatedBloodLossMl: DataTypes.INTEGER,
    complications: DataTypes.TEXT,
    spongeCountCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    instrumentCountCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    specimenSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notes: DataTypes.TEXT,
    recordedAt: DataTypes.DATE
  });

