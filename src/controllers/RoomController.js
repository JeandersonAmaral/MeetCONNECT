// src/controllers/RoomController.js
const jwt = require('jsonwebtoken');
const Room = require('../models/Room');
const RoomRepository = require("../repositories/RoomRepository");

class RoomController {
    async index(req, res) {
        const roomRepository = new RoomRepository();
        try {
            const rooms = await roomRepository.getAllRooms();
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async show(req, res) {
        const roomRepository = new RoomRepository();
        try {
            const room = await roomRepository.getRoomById(req.params.id);
            if (!room) {
                return res.status(404).json({ message: "Sala não encontrada" });
            }
            res.status(200).json(room);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async store(req, res) {
        const roomRepository = new RoomRepository();
        try {
            // Captura o token do header de autorização
            const token = req.headers.authorization.split(' ')[1]; 
            const decodedToken = jwt.verify(token, 'supersecretkey123'); // Decodifica o token

            // Extrai o ID ou nome do usuário do token
            const username = decodedToken.username; // Supondo que o nome do usuário esteja no token

            // Captura os dados da sala do corpo da requisição
            const { name, description, capacity } = req.body;

            // Cria a nova sala, incluindo o criador
            const newRoom = await roomRepository.createRoom({ 
                name, 
                description, 
                capacity, 
                createdBy: username // Passa o nome do criador
            });

            res.status(201).json({ message: "Sala criada com sucesso!", room: newRoom });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async update(req, res) {
        const roomRepository = new RoomRepository();
        try {
            const roomId = req.params.id; // Obtém o ID da sala dos parâmetros da requisição
            const { name, description, capacity } = req.body; // Dados que serão atualizados
            const updatedRoom = await roomRepository.updateRoom(roomId, { name, description, capacity });

            if (!updatedRoom) {
                return res.status(404).json({ message: "Sala não encontrada" });
            }

            res.status(200).json({ message: "Sala atualizada com sucesso!", room: updatedRoom });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async join(req, res) {
        const roomRepository = new RoomRepository();
        try {
            const { roomId } = req.body;
            const room = await roomRepository.getRoomById(roomId);
            if (!room) {
                return res.status(404).json({ message: "Sala não encontrada" });
            }
            res.status(200).json({ message: "Entrou na sala com sucesso", room });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async destroy(req, res) {
        const roomRepository = new RoomRepository();
        try {
            const roomId = req.params.id;
            const room = await roomRepository.getRoomById(roomId);
            if (!room) {
                return res.status(404).json({ message: "Sala não encontrada" });
            }
            await roomRepository.deleteRoom(roomId);
            res.status(200).json({ message: "Sala excluída com sucesso!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateRoomStatus(req, res) {
        const { id } = req.params; // Obtém o ID da sala a partir dos parâmetros da requisição
    
        try {
            const room = await Room.findById(id); // Encontra a sala pelo ID
            if (!room) {
                return res.status(404).json({ message: 'Sala não encontrada' }); // Retorna 404 se a sala não existir
            }
            
            room.isActive = !room.isActive; // Inverte o status da sala
            await room.save(); // Salva as alterações
            
            // Retorna apenas o objeto da sala sem mensagem de sucesso
            res.status(200).json(room);
        } catch (error) {
            console.error('Erro ao mudar o status da sala:', error); // Log do erro
            res.status(500).json({ message: 'Erro ao mudar o status da sala', error: error.message }); // Retorna 500 em caso de erro
        }
    }    

}

module.exports = new RoomController();
