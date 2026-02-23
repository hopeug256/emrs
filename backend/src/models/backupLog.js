const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("BackupLog", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    runAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM("Success", "Failed"),
      defaultValue: "Success"
    },
    detail: DataTypes.TEXT
  });

