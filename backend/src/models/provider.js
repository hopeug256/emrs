const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Provider", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    providerCode: {
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
    specialty: DataTypes.STRING,
    nationalId: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [14, 14],
        is: /^[A-Z0-9]{14}$/i
      }
    },
    phone: DataTypes.STRING,
    email: DataTypes.STRING
  });
