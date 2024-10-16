//src/services/socket.js
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken'); // Importa o JWT

let io;

const init = (httpServer) => {
    io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log(`Usuário conectado: ${socket.id}`);

        const token = socket.handshake.auth.token; // Extrai o token da autenticação

        // Verifica se o token é fornecido
        if (!token) {
            console.log(`Usuário ${socket.id} desconectado: Token não fornecido`);
            socket.disconnect(); // Desconecta se não houver token
            return;
        }

        // Verifica o token
        jwt.verify(token, 'supersecretkey123', (err, decoded) => {
            if (err) {
                console.log(`Usuário ${socket.id} desconectado: Token inválido`);
                socket.disconnect(); // Desconecta se o token for inválido
                return;
            }

            console.log(`Usuário autenticado: ${decoded.username}`);

            // Ouvindo quando o usuário entra em uma sala
            socket.on("joinRoom", (room) => {
                socket.join(room);
                console.log(`Usuário ${decoded.username} entrou na sala: ${room}`);
                socket.to(room).emit("userJoined", `${decoded.username}`);
            });

            // Ouvindo mensagens
            socket.on("sendMessage", ({ room, message }) => {
                io.to(room).emit("receiveMessage", { message, sender: decoded.username }); // Envia a mensagem para a sala
                console.log(`Mensagem enviada na sala ${room}: ${message}`); // Log para depuração
            });

            // Ouvindo quando o usuário desconecta
            socket.on("disconnect", () => {
                console.log(`Usuário desconectado: ${decoded.username}`);
            });
        });
    });
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { init, getIo };
