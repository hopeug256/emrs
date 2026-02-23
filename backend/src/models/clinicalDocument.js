const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ClinicalDocument", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: DataTypes.STRING,
    mimeType: DataTypes.STRING,
    contentText: DataTypes.TEXT,
    signedBy: DataTypes.STRING,
    signedAt: DataTypes.DATE
  });

