const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("ProviderAssignment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    status: {
      type: DataTypes.ENUM("Active", "Ended"),
      defaultValue: "Active"
    }
  });

