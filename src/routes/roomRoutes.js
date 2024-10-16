// src/routes/roomRoutes.js
const express = require('express');
const RoomController = require('../controllers/RoomController');
const router = express.Router();

// Rotas para as salas
router.get('/rooms', RoomController.index); // Lista todas as salas
router.get('/rooms/:id', RoomController.show); // Mostra uma sala pelo ID
router.post('/rooms', RoomController.store); // Cria uma nova sala
router.post('/rooms/:id/join', RoomController.join); // Endpoint para entrada na sala
router.delete('/rooms/:id', RoomController.destroy); // Exclui uma sala

module.exports = router;
