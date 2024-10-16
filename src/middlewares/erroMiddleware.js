// middlewares/errorMiddleware.js
const chalk = require("chalk");

const errorMiddleware = (err, req, res, next) => {
    const message = process.env.NODE_ENV === 'production' ? 'Erro no servidor' : err.stack;
    console.error(chalk.red(message));
    res.status(500).json({ message: "Algo deu errado!" });
};

module.exports = errorMiddleware;
