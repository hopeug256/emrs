const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ActionPlan", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dueDate: DataTypes.DATEONLY,
    status: {
      type: DataTypes.ENUM("Pending", "InProgress", "Completed", "Cancelled"),
      defaultValue: "Pending"
    }
  });

