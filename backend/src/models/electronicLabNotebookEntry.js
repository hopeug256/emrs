const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ElectronicLabNotebookEntry", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    entryNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    notebookSection: DataTypes.STRING,
    experimentTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hypothesis: DataTypes.TEXT,
    method: DataTypes.TEXT,
    observations: DataTypes.TEXT,
    conclusion: DataTypes.TEXT,
    signedBy: DataTypes.STRING,
    signedAt: DataTypes.DATE
  });
