const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PrescriptionCancellationRequest", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    requestNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM("Requested", "Approved", "Rejected"),
      defaultValue: "Requested"
    },
    reason: DataTypes.TEXT
  });

