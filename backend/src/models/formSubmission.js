const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("FormSubmission", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
