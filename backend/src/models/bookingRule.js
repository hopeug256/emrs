const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("BookingRule", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    allowRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    reminderHoursBefore: {
      type: DataTypes.INTEGER,
      defaultValue: 24
    },
    requireConfirmation: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

