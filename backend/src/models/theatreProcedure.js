const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("TheatreProcedure", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specialty: DataTypes.STRING,
    estimatedDurationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 60
    },
    riskLevel: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      defaultValue: "Medium"
    }
  });

