import express from 'express';
import driverController from '../controllers/driverController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', driverController.getAllDrivers);
router.get('/active', driverController.getActiveDrivers);
router.get('/statistics', driverController.getDriverStatistics);
router.get('/search', driverController.searchDrivers);
router.get('/:id', driverController.getDriverById);
router.post('/', driverController.createDriver);
router.put('/:id', driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);
router.post('/bulk-delete', driverController.bulkDeleteDrivers);

export default router;
