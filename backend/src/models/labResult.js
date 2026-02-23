const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("LabResult", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    resultNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM("Draft", "TechnicalVerified", "PathologistVerified", "FinalSigned"),
      defaultValue: "Draft"
    },
    comments: DataTypes.TEXT,
    finalizedAt: DataTypes.DATE
  });

