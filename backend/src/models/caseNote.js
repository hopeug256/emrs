const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("CaseNote", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    noteType: {
      type: DataTypes.ENUM("Assessment", "Progress", "General"),
      defaultValue: "General"
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

