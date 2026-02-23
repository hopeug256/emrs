const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("VisitVerification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    method: {
      type: DataTypes.ENUM("OTP", "Biometric", "Manual"),
      defaultValue: "Manual"
    },
    status: {
      type: DataTypes.ENUM("Pending", "Verified", "Failed"),
      defaultValue: "Pending"
    },
    verifiedAt: DataTypes.DATE
  });

