const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("LabInstrument", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    instrumentCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    manufacturer: DataTypes.STRING,
    interfaceMode: {
      type: DataTypes.ENUM("Manual", "HL7", "REST"),
      defaultValue: "REST"
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active"
    }
  });

