import express from 'express';
import pickupPointController from '../controllers/pickupPointController.js';

const router = express.Router();

router.get('/', pickupPointController.default.getAllPickupPoints);
router.get('/route/:routeId', pickupPointController.default.getPickupPointsByRoute);
router.get('/:id', pickupPointController.default.getPickupPointById);
router.post('/', pickupPointController.default.createPickupPoint);
router.put('/:id', pickupPointController.default.updatePickupPoint);
router.delete('/:id', pickupPointController.default.deletePickupPoint);
router.post('/bulk-delete', pickupPointController.default.bulkDeletePickupPoints);

export default router;
