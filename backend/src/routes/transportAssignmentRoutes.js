import express from 'express';
import transportAssignmentController from '../controllers/transportAssignmentController.js';

const router = express.Router();

router.get('/', transportAssignmentController.default.getAllAssignments);
router.get('/:id', transportAssignmentController.default.getAssignmentById);
router.post('/', transportAssignmentController.default.createAssignment);
router.put('/:id', transportAssignmentController.default.updateAssignment);
router.delete('/:id', transportAssignmentController.default.deleteAssignment);
router.post('/bulk-delete', transportAssignmentController.default.bulkDeleteAssignments);
router.get('/route/:routeId', transportAssignmentController.default.getAssignmentsByRoute);
router.get('/vehicle/:vehicleId', transportAssignmentController.default.getAssignmentsByVehicle);

export default router;