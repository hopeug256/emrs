const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Patient", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    mrn: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    nationalId: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [14, 14],
        is: /^[A-Z0-9]{14}$/i
      }
    },
    address: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active"
    }
  });
