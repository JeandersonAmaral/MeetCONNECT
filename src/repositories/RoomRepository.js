// src/repositories/RoomRepository.js
const Room = require('../models/Room');

class RoomRepository {
    async getAllRooms() {
        try {
            return await Room.find(); // Verifica se está retornando as salas corretamente
        } catch (error) {
            throw new Error('Erro ao obter as salas: ' + error.message);
        }
    }

    async getRoomById(id) {
        try {
            return await Room.findById(id);
        } catch (error) {
            throw new Error('Erro ao obter a sala: ' + error.message);
        }
    }

    async createRoom({ name, description, capacity }) {
        try {
            const newRoom = new Room({
                name,
                description,
                capacity,
                isActive: true,
                createdAt: new Date(),
            });
            return await newRoom.save();
        } catch (error) {
            throw new Error('Erro ao criar a sala: ' + error.message);
        }
    }

    async deleteRoom(id) {
        try {
            return await Room.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Erro ao deletar a sala: ' + error.message);
        }
    }
}

module.exports = RoomRepository; // Exporta uma instância do RoomRepository
