const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("EmCodingRecord", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: DataTypes.STRING,
    description: DataTypes.TEXT,
    billedAmount: DataTypes.DECIMAL(12, 2)
  });

