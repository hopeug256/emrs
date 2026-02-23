const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ChatMessage", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    messageNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    messageType: {
      type: DataTypes.ENUM("Text", "System"),
      defaultValue: "Text"
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sentAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
