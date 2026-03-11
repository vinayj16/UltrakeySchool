import express from 'express';
import bannedIPController from '../controllers/bannedIPController.js';
const {
  getAllBannedIPs,
  getBannedIPById,
  checkIPBanned,
  createBannedIP,
  updateBannedIP,
  deleteBannedIP,
  bulkDeleteBannedIPs
} = bannedIPController;


const router = express.Router();

router.get('/', getAllBannedIPs);
router.get('/:id', getBannedIPById);
router.get('/check/:ipAddress', checkIPBanned);
router.post('/', createBannedIP);
router.post('/bulk-delete', bulkDeleteBannedIPs);
router.put('/:id', updateBannedIP);
router.delete('/:id', deleteBannedIP);

export default router;
