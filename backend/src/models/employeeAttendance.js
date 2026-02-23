const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("EmployeeAttendance", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    attendanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    checkInAt: DataTypes.DATE,
    checkOutAt: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Leave", "HalfDay"),
      defaultValue: "Present"
    },
    remarks: DataTypes.TEXT
  });

