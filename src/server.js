// server.js
const express = require("express");
const http = require("http");
const path = require("path");
const connectMongoDB = require("./config/mongo");
const { connectPostgreSQL,syncDatabase, sequelize } = require("./config/postgre");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const errorMiddleware = require("./middlewares/erroMiddleware"); 
const chalk = require("chalk");
const socketService = require("./services/socket");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


//Connectar aos bancos
connectMongoDB();
connectPostgreSQL();
syncDatabase();

// Usar as rotas
app.use("/api/", userRoutes);
app.use("/api/", roomRoutes);

// Middleware de tratamento de erros
app.use(errorMiddleware); 

// Iniciar o servidor
server.listen(PORT, () => {
    console.log(chalk.blue(`Servidor rodando na porta ${PORT}`));
    console.log(chalk.yellow("Acesso ->",(chalk.red(`http://localhost:${PORT}/html/login.html`))));
});
