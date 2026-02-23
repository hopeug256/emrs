const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("CreditControlEvent", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    eventNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    eventType: {
      type: DataTypes.ENUM("Reminder", "Escalation", "PaymentPlan", "WriteOff", "Collection"),
      defaultValue: "Reminder"
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    dueDate: DataTypes.DATEONLY,
    notes: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("Open", "Resolved", "Cancelled"),
      defaultValue: "Open"
    }
  });
