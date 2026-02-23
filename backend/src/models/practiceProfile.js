const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("PracticeProfile", {
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
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

