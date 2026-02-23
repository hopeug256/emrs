const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Claim", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    claimNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    claimType: {
      type: DataTypes.ENUM("Electronic", "Paper"),
      defaultValue: "Electronic"
    },
    status: {
      type: DataTypes.ENUM("Draft", "Submitted", "InReview", "Approved", "Rejected", "Paid"),
      defaultValue: "Draft"
    },
    amountClaimed: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    amountApproved: DataTypes.DECIMAL(12, 2),
    submittedAt: DataTypes.DATE,
    adjudicatedAt: DataTypes.DATE,
    rejectionReason: DataTypes.TEXT
  });

