import express from 'express';
import * as transportRouteController from '../controllers/transportRouteController.js';

const router = express.Router();

router.get('/', transportRouteController.getAllRoutes);
router.get('/active', transportRouteController.getActiveRoutes);
router.get('/:id', transportRouteController.getRouteById);
router.post('/', transportRouteController.createRoute);
router.put('/:id', transportRouteController.updateRoute);
router.delete('/:id', transportRouteController.deleteRoute);
router.post('/bulk-delete', transportRouteController.bulkDeleteRoutes);

export default router;
