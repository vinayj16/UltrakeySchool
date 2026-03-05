import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as superAdminController from '../controllers/superAdminController.js';

const router = express.Router();

router.use(authenticate);

router.get('/institutions', superAdminController.getInstitutions);

export default router;
