const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("FormField", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("text", "number", "date", "select", "textarea", "checkbox"),
      allowNull: false
    },
    required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    options: {
      type: DataTypes.TEXT
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

