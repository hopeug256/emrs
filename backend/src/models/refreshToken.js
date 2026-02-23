const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("RefreshToken", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    revokedAt: {
      type: DataTypes.DATE
    },
    replacedByTokenId: {
      type: DataTypes.UUID
    }
  });
