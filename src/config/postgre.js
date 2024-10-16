// src/config/postgre.js
const chalk = require("chalk");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error(chalk.red("Erro: DATABASE_URL não está definido."));
    process.exit(1);
}

const sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});

const connectPostgreSQL = async () => {
    try {
        await sequelize.authenticate();
        console.log(chalk.cyan("PostgreSQL Conectado"));
    } catch (error) {
        console.error(chalk.red("Não foi possível conectar ao PostgreSQL:", error.message));
        process.exit(1);
    }
};

// Sincronizar Tabelas
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Considere o uso cauteloso de `alter: true`
        console.log(chalk.cyan("Tabelas sincronizadas"));
    } catch (error) {
        console.error(chalk.red("Erro ao sincronizar as tabelas:", error.message));
    }
};

module.exports = { sequelize, connectPostgreSQL, syncDatabase };
