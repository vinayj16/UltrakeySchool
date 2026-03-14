import express from 'express';
import sportController from '../controllers/sportController.js';

const router = express.Router();

// Sport Routes
router.post('/', sportController.createSport);
router.get('/', sportController.getAllSports);
router.get('/:id', sportController.getSportById);
router.put('/:id', sportController.updateSport);
router.delete('/:id', sportController.deleteSport);

export default router;