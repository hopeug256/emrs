const { Sequelize } = require("sequelize");

const dbStorage = process.env.DB_STORAGE || "./database.sqlite";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbStorage,
  logging: false
});

module.exports = sequelize;
