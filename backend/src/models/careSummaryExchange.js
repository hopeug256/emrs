const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("CareSummaryExchange", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    exchangeNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    direction: {
      type: DataTypes.ENUM("Outbound", "Inbound"),
      defaultValue: "Outbound"
    },
    status: {
      type: DataTypes.ENUM("Draft", "Sent", "Received", "Failed"),
      defaultValue: "Draft"
    },
    payload: DataTypes.TEXT
  });
