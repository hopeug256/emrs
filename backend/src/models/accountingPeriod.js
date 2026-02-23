const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("AccountingPeriod", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    periodCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    periodName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fiscalYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Open", "Closed"),
      allowNull: false,
      defaultValue: "Open"
    }
  });
