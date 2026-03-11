import express from 'express';
import transportRouteController from '../controllers/transportRouteController.js';

const router = express.Router();

router.get('/', transportRouteController.default.getAllRoutes);
router.get('/active', transportRouteController.default.getActiveRoutes);
router.get('/:id', transportRouteController.default.getRouteById);
router.post('/', transportRouteController.default.createRoute);
router.put('/:id', transportRouteController.default.updateRoute);
router.delete('/:id', transportRouteController.default.deleteRoute);
router.post('/bulk-delete', transportRouteController.default.bulkDeleteRoutes);

export default router;