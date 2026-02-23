const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("LabTest", {
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
    specimenType: DataTypes.STRING,
    normalRange: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2)
  });

