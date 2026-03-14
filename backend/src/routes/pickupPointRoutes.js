import express from 'express';
import pickupPointController from '../controllers/pickupPointController.js';

const router = express.Router();

router.get('/', pickupPointController.getAllPickupPoints);
router.get('/route/:routeId', pickupPointController.getPickupPointsByRoute);
router.get('/:id', pickupPointController.getPickupPointById);
router.post('/', pickupPointController.createPickupPoint);
router.put('/:id', pickupPointController.updatePickupPoint);
router.delete('/:id', pickupPointController.deletePickupPoint);
router.post('/bulk-delete', pickupPointController.bulkDeletePickupPoints);

export default router;
