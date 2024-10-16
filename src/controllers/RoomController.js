// src/controllers/RoomController.js
const RoomRepository = require("../repositories/RoomRepository");

class RoomController {
    async index(req, res) {
        const roomRepository = new RoomRepository(); // Instancia o RoomRepository aqui
        try {
            const rooms = await roomRepository.getAllRooms();
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async show(req, res) {
        const roomRepository = new RoomRepository(); // Instancia o RoomRepository aqui
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
        const roomRepository = new RoomRepository(); // Instancia o RoomRepository aqui
        try {
            const { name, description, capacity } = req.body;
            const newRoom = await roomRepository.createRoom({ name, description, capacity });
            res.status(201).json({ message: "Sala criada com sucesso!", room: newRoom });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async join(req, res) {
        const roomRepository = new RoomRepository(); // Instancia o RoomRepository aqui
        try {
            const { roomId } = req.body;
            const room = await roomRepository.getRoomById(roomId);
            if (!room) {
                return res.status(404).json({ message: "Sala não encontrada" });
            }
            // Lógica adicional para participação na sala, se necessário
            res.status(200).json({ message: "Entrou na sala com sucesso", room });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async destroy(req, res) {
        const roomRepository = new RoomRepository(); // Instancia o RoomRepository aqui
        try {
            const roomId = req.params.id; // Obtém o ID da sala a partir dos parâmetros da requisição
            const room = await roomRepository.getRoomById(roomId);
            if (!room) {
                return res.status(404).json({ message: "Sala não encontrada" });
            }
            await roomRepository.deleteRoom(roomId); // Chama o repositório para excluir a sala
            res.status(200).json({ message: "Sala excluída com sucesso!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new RoomController(); // Exporta uma instância do RoomController
