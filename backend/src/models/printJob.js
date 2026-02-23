const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PrintJob", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    jobNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    templateName: DataTypes.STRING,
    payload: DataTypes.TEXT,
    printerName: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Queued", "Printed", "Failed"),
      defaultValue: "Queued"
    },
    printedAt: DataTypes.DATE
  });

