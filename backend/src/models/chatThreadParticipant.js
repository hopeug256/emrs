const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ChatThreadParticipant", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    role: {
      type: DataTypes.ENUM("Owner", "Member"),
      defaultValue: "Member"
    },
    muted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
