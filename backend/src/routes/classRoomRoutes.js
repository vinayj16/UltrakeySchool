import express from 'express';
import classRoomController from '../controllers/classRoomController.js';
import * as validators from '../validators/classRoomValidators.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validators.createClassRoomValidator, classRoomController.createClassRoom);
router.get('/', classRoomController.getAllClassRooms);
router.get('/statistics', classRoomController.getClassRoomStatistics);
router.get('/search', validators.searchValidator, classRoomController.searchClassRooms);
router.get('/available', classRoomController.getAvailableClassRooms);
router.get('/status/:status', classRoomController.getClassRoomsByStatus);
router.get('/institution/:institutionId', classRoomController.getClassRoomsByInstitution);
router.get('/building/:building', classRoomController.getClassRoomsByBuilding);
router.get('/floor/:floor', classRoomController.getClassRoomsByFloor);
router.get('/roomId/:roomId', classRoomController.getClassRoomByRoomId);
router.get('/:id', validators.roomIdValidator, classRoomController.getClassRoomById);
router.put('/:id', validators.roomIdValidator, validators.updateClassRoomValidator, classRoomController.updateClassRoom);
router.delete('/:id', validators.roomIdValidator, classRoomController.deleteClassRoom);
router.patch('/:id/assign', validators.roomIdValidator, classRoomController.assignClassToRoom);
router.patch('/:id/unassign', validators.roomIdValidator, classRoomController.unassignClassFromRoom);
router.patch('/:id/occupancy', validators.roomIdValidator, classRoomController.updateOccupancy);
router.post('/:id/maintenance', validators.roomIdValidator, classRoomController.addMaintenanceSchedule);
router.patch('/bulk/status', classRoomController.bulkUpdateStatus);

export default router;
