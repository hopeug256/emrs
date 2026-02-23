const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("LabPanelAnalyte", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    required: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

