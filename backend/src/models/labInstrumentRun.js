const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("LabInstrumentRun", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    runNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    rawPayload: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("Received", "Processed", "Failed"),
      defaultValue: "Received"
    },
    processedAt: DataTypes.DATE
  });

