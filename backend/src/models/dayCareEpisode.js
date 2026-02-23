const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("DayCareEpisode", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    episodeNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    procedureName: DataTypes.STRING,
    plannedStart: DataTypes.DATE,
    plannedEnd: DataTypes.DATE,
    actualStart: DataTypes.DATE,
    actualEnd: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("Scheduled", "InProgress", "Completed", "Cancelled"),
      defaultValue: "Scheduled"
    },
    outcome: DataTypes.TEXT
  });
