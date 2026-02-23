const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("RevenueCycleTask", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    taskNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    taskType: {
      type: DataTypes.ENUM("Coding", "Submission", "FollowUp", "Denial", "Collections"),
      defaultValue: "Submission"
    },
    status: {
      type: DataTypes.ENUM("Open", "InProgress", "Closed"),
      defaultValue: "Open"
    },
    notes: DataTypes.TEXT,
    dueDate: DataTypes.DATEONLY
  });

