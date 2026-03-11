import express from 'express';
import sportController from '../controllers/sportController.js';

const router = express.Router();

// Sport Routes
router.post('/', sportController.default.createSport);
router.get('/', sportController.default.getAllSports);
router.get('/:id', sportController.default.getSportById);
router.put('/:id', sportController.default.updateSport);
router.delete('/:id', sportController.default.deleteSport);

export default router;