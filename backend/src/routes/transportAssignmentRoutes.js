import express from 'express';
import * as transportAssignmentController from '../controllers/transportAssignmentController.js';

const router = express.Router();

router.get('/', transportAssignmentController.getAllAssignments);
router.get('/:id', transportAssignmentController.getAssignmentById);
router.post('/', transportAssignmentController.createAssignment);
router.put('/:id', transportAssignmentController.updateAssignment);
router.delete('/:id', transportAssignmentController.deleteAssignment);
router.post('/bulk-delete', transportAssignmentController.bulkDeleteAssignments);
router.get('/route/:routeId', transportAssignmentController.getAssignmentsByRoute);
router.get('/vehicle/:vehicleId', transportAssignmentController.getAssignmentsByVehicle);

export default router;
