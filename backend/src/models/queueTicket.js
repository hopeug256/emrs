const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("QueueTicket", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tokenNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    servicePoint: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Waiting", "Called", "InService", "Completed", "NoShow", "Cancelled"),
      defaultValue: "Waiting"
    },
    priority: {
      type: DataTypes.ENUM("Normal", "High", "Emergency"),
      defaultValue: "Normal"
    },
    calledAt: DataTypes.DATE,
    completedAt: DataTypes.DATE
  });

