const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Admission", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    admissionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    admittedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dischargedAt: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("Admitted", "Transferred", "Discharged"),
      defaultValue: "Admitted"
    },
    reason: DataTypes.TEXT
  });

