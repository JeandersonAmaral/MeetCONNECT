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
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Token não fornecido' });
            }
    
            const token = authHeader.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
            const username = decodedToken.username; // Extrai o nome do usuário do token
            const userId = decodedToken.id; // Certifique-se de que o ID do usuário está no token
    
            const { name, description, capacity } = req.body; // Captura os dados da sala
    
            if (!name || !capacity) {
                return res.status(400).json({ message: 'Nome e capacidade são obrigatórios.' });
            }
    
            const newRoom = await roomRepository.createRoom({
                name,
                description,
                capacity,
                createdBy: username,  // Nome do criador
                creatorId: userId      // ID do criador
            });
    
            res.status(201).json({ message: "Sala criada com sucesso!", room: newRoom });
        } catch (error) {
            console.error('Erro ao criar sala:', error);
            res.status(500).json({ message: 'Erro ao criar a sala', error });
        }
    }    

    async update(req, res) {
        const roomRepository = new RoomRepository();
        try {
            const roomId = req.params.id;
            const { name, description, capacity } = req.body;

            const room = await roomRepository.getRoomById(roomId);
            if (!room) {
                return res.status(404).json({ message: "Sala não encontrada" });
            }

            // Verifica se o usuário logado é o criador da sala
            if (room.creatorId !== req.user.id) {
                return res.status(403).json({ message: "Você não tem permissão para editar esta sala" });
            }

            const updatedRoom = await roomRepository.updateRoom(roomId, { name, description, capacity });
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
    
            // Verifica se o usuário logado é o criador da sala
            const creatorId = room.creatorId.toString();  // Converte creatorId para String
            const userId = req.user.id.toString();        // Converte userId para String
    
            console.log("Criador da sala:", creatorId);  // Adicionado log
            console.log("Usuário autenticado:", userId); // Adicionado log
    
            // Compara os IDs como Strings
            if (creatorId !== userId) {
                return res.status(403).json({ message: "Você não tem permissão para excluir esta sala" });
            }
    
            // Executa a exclusão da sala
            await roomRepository.deleteRoom(roomId);
            res.status(200).json({ message: "Sala excluída com sucesso!" });
        } catch (error) {
            console.error("Erro ao excluir a sala:", error); // Log do erro
            res.status(500).json({ message: error.message });
        }
    }
    
    async updateRoomStatus(req, res) {
        const { id } = req.params;
        try {
            const room = await Room.findById(id);
            if (!room) {
                return res.status(404).json({ message: 'Sala não encontrada' });
            }

            // Verifica se o usuário logado é o criador da sala
            if (room.creatorId !== req.user.id) {
                return res.status(403).json({ message: "Você não tem permissão para alterar o status desta sala" });
            }

            room.isActive = !room.isActive; // Inverte o status da sala
            await room.save();
            res.status(200).json(room);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao mudar o status da sala', error: error.message });
        }
    }    
}

module.exports = new RoomController();
