import express from 'express';
import userProfileController from '../controllers/userProfileController.js';
const {
  getUserProfile,
  updateUserProfile,
  getUserPermissions
} = userProfileController;

import { authenticate } from '../middleware/authMiddleware.js';
import { updateUserProfileValidation } from '../validators/userProfileValidators.js';

const router = express.Router();

router.get(
  '/me',
  authenticate,
  getUserProfile
);

router.put(
  '/me',
  authenticate,
  updateUserProfileValidation,
  updateUserProfile
);

router.get(
  '/me/permissions',
  authenticate,
  getUserPermissions
);

export default router;
