const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Employee", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employeeCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    designation: DataTypes.STRING,
    employmentType: {
      type: DataTypes.ENUM("FullTime", "PartTime", "Contract"),
      defaultValue: "FullTime"
    },
    dateOfJoin: DataTypes.DATEONLY,
    baseSalary: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active"
    }
  });

