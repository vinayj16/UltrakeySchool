import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import customFieldController from '../controllers/customFieldController.js';

const router = express.Router();
router.use(authenticate);

router.post('/schools/:schoolId', customFieldController.createField);
router.get('/schools/:schoolId/:entityType', customFieldController.getFields);
router.get('/schools/:schoolId/:entityType/:fieldId', customFieldController.getFieldById);
router.put('/schools/:schoolId/:entityType/:fieldId', customFieldController.updateField);
router.delete('/schools/:schoolId/:entityType/:fieldId', customFieldController.deleteField);
router.patch('/schools/:schoolId/:entityType/reorder', customFieldController.reorderFields);

export default router;
