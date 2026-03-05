import express from 'express';
import sportController from '../controllers/sportController.js';

const router = express.Router();

// Sport Routes
router.post('/', sportController.create);
router.get('/', sportController.getAll);
router.get('/:id', sportController.getById);
router.put('/:id', sportController.update);
router.delete('/:id', sportController.delete);

export default router;
