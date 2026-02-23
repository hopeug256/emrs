const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("LabOrder", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM("Ordered", "Collected", "InProgress", "Completed", "Cancelled"),
      defaultValue: "Ordered"
    },
    resultText: DataTypes.TEXT,
    labPanelId: DataTypes.UUID,
    workflowStatus: {
      type: DataTypes.ENUM("Pending", "TechnicalVerified", "PathologistVerified", "FinalSigned"),
      defaultValue: "Pending"
    },
    orderedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    reportedAt: DataTypes.DATE
  });
