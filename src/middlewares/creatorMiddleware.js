const jwt = require('jsonwebtoken');
const Room = require('../models/Room');

async function creatorMiddleware(req, res, next) {
    const roomId = req.params.id;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];  // Extrai o token do cabeçalho de autorização
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);  // Decodifica o token
        const userId = decodedToken.id.toString();  // Converte o ID do usuário para String

        console.log("Usuário autenticado (ID como String):", userId);  // Exibe o ID como String

        const room = await Room.findById(roomId);  // Busca a sala no banco de dados
        if (!room) {
            return res.status(404).json({ message: 'Sala não encontrada' });
        }

        const creatorId = room.creatorId.toString();  // Converte o creatorId para String

        console.log("Criador da sala (ID como String):", creatorId);  // Exibe o creatorId como String

        // Verifica se o usuário autenticado é o criador da sala
        if (creatorId !== userId) {
            return res.status(403).json({ message: 'Acesso negado: você não é o criador desta sala.' });
        }

        next();  // O usuário é o criador, permite continuar
    } catch (error) {
        console.error('Erro ao verificar permissões:', error);  // Adiciona um log de erro
        return res.status(500).json({ message: 'Erro ao verificar permissões', error });
    }
}

module.exports = creatorMiddleware;
