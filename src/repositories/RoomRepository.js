// src/repositories/RoomRepository.js
const Room = require('../models/Room');
const { v4: isUuid } = require('uuid'); // Verificação de UUID

class RoomRepository {
    // Retorna todas as salas
    async getAllRooms() {
        try {
            return await Room.find();
        } catch (error) {
            throw new Error('Erro ao obter as salas: ' + error.message);
        }
    }

    // Retorna uma sala por ID
    async getRoomById(id) {
        try {
            return await Room.findById(id);
        } catch (error) {
            throw new Error('Erro ao obter a sala: ' + error.message);
        }
    }

    // Cria uma nova sala
    async createRoom({ name, description, capacity, createdBy, creatorId }) { // Inclui creatorId
        try {
            const newRoom = new Room({
                name,
                description,
                capacity,
                isActive: true,
                createdAt: new Date(),
                createdBy,  // Nome do criador da sala
                creatorId   // ID do criador da sala
            });
            return await newRoom.save(); // Salva a nova sala
        } catch (error) {
            throw new Error('Erro ao criar a sala: ' + error.message);
        }
    }
    
    // Atualiza uma sala existente
    async updateRoom(id, { name, description, capacity }) {
        try {
            return await Room.findByIdAndUpdate(
                id,
                { name, description, capacity },
                { new: true } // Retorna a sala atualizada
            );
        } catch (error) {
            throw new Error('Erro ao atualizar a sala: ' + error.message);
        }
    }

    // Deleta uma sala por ID
    async deleteRoom(id) {
        try {
            if (!isUuid(id)) {
                throw new Error('ID inválido');
            }
    
            console.log(`Tentando deletar a sala com ID: ${id}`);
            const room = await Room.findByIdAndDelete(id);
    
            if (!room) {
                throw new Error('Sala não encontrada');
            }
    
            console.log(`Sala com ID ${id} deletada com sucesso`);
            return room;
        } catch (error) {
            console.error('Erro ao deletar a sala:', error);
            throw new Error('Erro ao deletar a sala: ' + error.message);
        }
    }
    

    // Atualiza o status da sala (ativa/inativa)
    async updateRoomStatus(roomId, status) {
        try {
            const room = await Room.findById(roomId); // Utilizando o Mongoose
            if (!room) {
                throw new Error("Sala não encontrada.");
            }
            room.isActive = status; // Atualiza o status da sala
            await room.save(); // Salva a alteração
            return room; // Retorna a sala atualizada
        } catch (error) {
            throw new Error('Erro ao atualizar o status da sala: ' + error.message);
        }
    }
}

module.exports = RoomRepository;
