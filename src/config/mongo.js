// src/config/mongo.js
const chalk = require("chalk");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error(chalk.red("Erro: MONGO_URI não está definido."));
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log(chalk.cyan("MongoDB Conectado"));
    } catch (error) {
        console.error(chalk.red(`Erro ao conectar ao MongoDB: ${error.message}`));
        process.exit(1);
    }
};

module.exports = connectDB;
