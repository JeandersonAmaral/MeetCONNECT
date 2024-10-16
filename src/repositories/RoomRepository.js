// src/repositories/RoomRepository.js
const Room = require('../models/Room');

class RoomRepository {
    async getAllRooms() {
        try {
            return await Room.find(); // Retorna todas as salas
        } catch (error) {
            throw new Error('Erro ao obter as salas: ' + error.message);
        }
    }

    async getRoomById(id) {
        try {
            return await Room.findById(id); // Retorna a sala por ID
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
            return await newRoom.save(); // Cria e salva a nova sala
        } catch (error) {
            throw new Error('Erro ao criar a sala: ' + error.message);
        }
    }

    async updateRoom(id, { name, description, capacity }) {
        try {
            return await Room.findByIdAndUpdate(
                id,
                { name, description, capacity },
                { new: true } // Retorna o documento atualizado
            );
        } catch (error) {
            throw new Error('Erro ao atualizar a sala: ' + error.message);
        }
    }

    async deleteRoom(id) {
        try {
            return await Room.findByIdAndDelete(id); // Deleta a sala por ID
        } catch (error) {
            throw new Error('Erro ao deletar a sala: ' + error.message);
        }
    }
}

module.exports = RoomRepository; // Exporta o repositório de salas
