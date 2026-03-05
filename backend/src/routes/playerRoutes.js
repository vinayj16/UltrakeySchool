import express from 'express';
const router = express.Router();
import playerController from '../controllers/playerController.js';

// Player Routes
router.post('/', playerController.create);
router.get('/', playerController.getAll);
router.get('/:id', playerController.getById);
router.put('/:id', playerController.update);
router.delete('/:id', playerController.delete);

export default router;
