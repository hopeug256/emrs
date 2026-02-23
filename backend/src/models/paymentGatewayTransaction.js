const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PaymentGatewayTransaction", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    transactionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    gatewayName: {
      type: DataTypes.ENUM("Flutterwave", "MTNMoMo", "AirtelMoney", "Stripe", "Custom"),
      defaultValue: "Custom"
    },
    externalReference: DataTypes.STRING,
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "UGX"
    },
    status: {
      type: DataTypes.ENUM("Initiated", "Authorized", "Captured", "Failed", "Voided"),
      defaultValue: "Initiated"
    },
    requestPayload: DataTypes.TEXT,
    responsePayload: DataTypes.TEXT,
    processedAt: DataTypes.DATE
  });
