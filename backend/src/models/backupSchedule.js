const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("BackupSchedule", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    frequency: {
      type: DataTypes.ENUM("Hourly", "Daily", "Weekly"),
      defaultValue: "Daily"
    },
    targetPath: DataTypes.STRING,
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    continuousBackup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

