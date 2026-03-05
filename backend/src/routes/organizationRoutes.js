import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as organizationController from '../controllers/organizationController.js';

const router = express.Router();
router.use(authenticate);

router.post('/', organizationController.create);
router.get('/', organizationController.findAll);
router.get('/code/:code', organizationController.findByCode);
router.get('/:id', organizationController.findById);
router.put('/:id', organizationController.update);
router.delete('/:id', organizationController.deleteOrg);
router.patch('/:id/subscription', organizationController.updateSubscription);

export default router;
