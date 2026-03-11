import express from 'express';
const router = express.Router();
import playerController from '../controllers/playerController.js';

// Player Routes
router.post('/', playerController.default.create);
router.get('/', playerController.default.getAll);
router.get('/:id', playerController.default.getById);
router.put('/:id', playerController.default.update);
router.delete('/:id', playerController.default.delete);

export default router;
