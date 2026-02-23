const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("InsurancePolicy", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    policyNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    memberId: DataTypes.STRING,
    planName: DataTypes.STRING,
    coverageLimit: DataTypes.DECIMAL(12, 2),
    coPayAmount: DataTypes.DECIMAL(10, 2),
    deductibleAmount: DataTypes.DECIMAL(10, 2),
    status: {
      type: DataTypes.ENUM("Active", "Expired", "Pending"),
      defaultValue: "Active"
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  });

