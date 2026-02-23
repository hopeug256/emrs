const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("SecurityEvent", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sourceIp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT
    }
  });
