import express from 'express';
import transportReportController from '../controllers/transportReportController.js';

const router = express.Router();

router.get('/', transportReportController.default.getAllReports);
router.get('/statistics', transportReportController.default.getTransportStatistics);
router.get('/search', transportReportController.default.searchReports);
router.get('/type/:reportType', transportReportController.default.getReportsByType);
router.get('/:id', transportReportController.default.getReportById);
router.post('/', transportReportController.default.generateReport);
router.put('/:id', transportReportController.default.updateReport);
router.delete('/:id', transportReportController.default.deleteReport);
router.post('/bulk-delete', transportReportController.default.bulkDeleteReports);

export default router;
