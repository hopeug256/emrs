const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM("admin", "doctor", "nurse", "receptionist", "patient"),
        allowNull: false
      },
      patientId: {
        type: DataTypes.UUID
      },
      mustChangePassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      defaultScope: {
        attributes: { exclude: ["passwordHash"] }
      },
      scopes: {
        withPassword: {
          attributes: { include: ["passwordHash"] }
        }
      }
    }
  );
