import express from 'express';
import commissionController from '../controllers/commissionController.js';
const {
  createCommission,
  getCommissionById,
  getCommissionsByAgent,
  getCommissionSummary,
  updateCommissionStatus,
  updateCommission,
  deleteCommission,
  getAllCommissions,
  getCommissionStatistics
} = commissionController;


const router = express.Router();

router.post('/', createCommission);
router.get('/', getAllCommissions);
router.get('/statistics', getCommissionStatistics);
router.get('/:id', getCommissionById);
router.get('/agent/:agentId', getCommissionsByAgent);
router.get('/agent/:agentId/summary', getCommissionSummary);
router.patch('/:id/status', updateCommissionStatus);
router.put('/:id', updateCommission);
router.delete('/:id', deleteCommission);

export default router;
