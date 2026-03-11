import express from 'express';
import dashboardWidgetController from '../controllers/dashboardWidgetController.js';
import { authenticate, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(protect);

// Widget CRUD
router.post('/', dashboardWidgetController.createWidget);
router.get('/', dashboardWidgetController.getUserWidgets);
router.get('/:widgetId', dashboardWidgetController.getWidgetById);
router.put('/:widgetId', dashboardWidgetController.updateWidget);
router.delete('/:widgetId', dashboardWidgetController.deleteWidget);

// Widget operations
router.put('/:widgetId/position', dashboardWidgetController.updateWidgetPosition);
router.put('/:widgetId/size', dashboardWidgetController.updateWidgetSize);
router.put('/:widgetId/toggle', dashboardWidgetController.toggleWidgetVisibility);
router.post('/reorder', dashboardWidgetController.reorderWidgets);
router.get('/:widgetId/data', dashboardWidgetController.getWidgetData);

// Templates
router.get('/templates/list', dashboardWidgetController.getWidgetTemplates);
router.post('/templates', dashboardWidgetController.createWidgetTemplate);

// Reset
router.post('/reset', dashboardWidgetController.resetToDefault);

export default router;
