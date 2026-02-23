const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("CaseRecord", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    caseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    diagnosis: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Open", "OnHold", "Closed"),
      defaultValue: "Open"
    }
  });

