// Middleware para verificar se o usuário logado é o criador da sala
async function isRoomOwner(req, res, next) {
    const roomId = req.params.id; // ID da sala, geralmente vindo da URL
    const userId = req.user.id;  // ID do usuário logado (JWT decodificado)

    try {
        const room = await Room.findById(roomId);  // Busca a sala pelo ID
        if (!room) {
            return res.status(404).json({ message: 'Sala não encontrada' });
        }

        if (room.creatorId !== userId) {  // Verifica se o usuário é o criador da sala
            return res.status(403).json({ message: 'Acesso negado: você não é o criador desta sala' });
        }

        next();  // O usuário é o criador, pode continuar
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar permissões', error });
    }
}
