const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("CaseApproval", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    approvalType: DataTypes.STRING,
    decision: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending"
    },
    remarks: DataTypes.TEXT
  });

