const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("AccountingPolicy", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: "Uganda"
    },
    currencyCode: {
      type: DataTypes.STRING,
      defaultValue: "UGX"
    },
    vatRatePercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 18.0
    },
    withholdingTaxPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 6.0
    },
    payeThresholdUgx: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 235000
    },
    efrisEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

