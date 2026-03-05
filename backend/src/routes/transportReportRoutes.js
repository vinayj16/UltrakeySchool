import express from 'express';
import * as transportReportController from '../controllers/transportReportController.js';

const router = express.Router();

router.get('/', transportReportController.getAllReports);
router.get('/statistics', transportReportController.getTransportStatistics);
router.get('/search', transportReportController.searchReports);
router.get('/type/:reportType', transportReportController.getReportsByType);
router.get('/:id', transportReportController.getReportById);
router.post('/', transportReportController.generateReport);
router.put('/:id', transportReportController.updateReport);
router.delete('/:id', transportReportController.deleteReport);
router.post('/bulk-delete', transportReportController.bulkDeleteReports);

export default router;
