const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Visit", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    checkInAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    checkOutAt: DataTypes.DATE,
    type: {
      type: DataTypes.ENUM("Outpatient", "Inpatient", "Emergency"),
      defaultValue: "Outpatient"
    },
    status: {
      type: DataTypes.ENUM("Open", "Closed", "Cancelled"),
      defaultValue: "Open"
    },
    notes: DataTypes.TEXT
  });

