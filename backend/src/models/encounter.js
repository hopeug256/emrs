const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Encounter", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    encounterDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    encounterType: {
      type: DataTypes.ENUM("Consultation", "Lab", "Procedure", "FollowUp"),
      defaultValue: "Consultation"
    },
    diagnosis: DataTypes.STRING,
    observations: DataTypes.TEXT
  });

