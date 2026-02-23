const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Referral", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    referralNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    referralType: {
      type: DataTypes.ENUM("Internal", "External"),
      defaultValue: "Internal"
    },
    reason: DataTypes.TEXT,
    destinationFacility: DataTypes.STRING,
    destinationDepartment: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Draft", "Sent", "Accepted", "Completed", "Declined"),
      defaultValue: "Draft"
    },
    referredAt: DataTypes.DATE,
    feedbackNotes: DataTypes.TEXT
  });
