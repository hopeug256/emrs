const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Notification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    channel: {
      type: DataTypes.ENUM("SMS", "Email", "InApp"),
      defaultValue: "InApp"
    },
    type: {
      type: DataTypes.ENUM("AppointmentReminder", "PaymentReminder", "GeneralAlert"),
      defaultValue: "GeneralAlert"
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Queued", "Sent", "Failed"),
      defaultValue: "Queued"
    },
    sentAt: DataTypes.DATE
  });
