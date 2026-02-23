const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("JournalEntry", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    entryNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    entryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    description: DataTypes.TEXT,
    debitAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    creditAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Draft", "Posted"),
      defaultValue: "Draft"
    }
  });

