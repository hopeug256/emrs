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
    referenceNumber: DataTypes.STRING,
    sourceModule: DataTypes.STRING,
    description: DataTypes.TEXT,
    debitAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    creditAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM("Draft", "Posted"),
      defaultValue: "Draft"
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    postedByUserId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  });
