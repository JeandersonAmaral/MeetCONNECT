const express = require('express');
const RoomController = require('../controllers/RoomController');
const creatorMiddleware = require('../middlewares/creatorMiddleware'); // Middleware de verificação do criador
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticação

const router = express.Router();

// Rotas para as salas
router.get('/rooms', RoomController.index); // Lista todas as salas
router.get('/rooms/:id', RoomController.show); // Mostra uma sala pelo ID
router.post('/rooms', authMiddleware, RoomController.store); // Cria uma nova sala (somente usuários autenticados)
router.post('/rooms/:id/join', authMiddleware, RoomController.join); // Entra em uma sala (somente usuários autenticados)

// Rotas protegidas pelo middleware de autenticação e verificação de criador
router.delete('/rooms/:id', authMiddleware, creatorMiddleware, RoomController.destroy); // Exclui uma sala (somente criador)
router.put('/rooms/:id', authMiddleware, creatorMiddleware, RoomController.update); // Atualiza uma sala (somente criador)
router.put('/rooms/:id/status', authMiddleware, creatorMiddleware, RoomController.updateRoomStatus); // Atualiza o status da sala (somente criador)

module.exports = router;
