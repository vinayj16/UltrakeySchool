import express from 'express';
const router = express.Router();
import playerController from '../controllers/playerController.js';

// Player Routes
router.post('/', playerController.createPlayer);
router.get('/', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);

export default router;
