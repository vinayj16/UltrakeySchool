import express from 'express';
import advancedAttendanceController from '../controllers/advancedAttendanceController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authGuard.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Biometric Attendance
router.post(
  '/biometric/register',
  advancedAttendanceController.registerBiometric
);

router.post(
  '/biometric/verify',
  advancedAttendanceController.verifyBiometric
);

router.get(
  '/biometric/devices',
  authorize(['teacher', 'principal', 'school_admin', 'super_admin']),
  advancedAttendanceController.getBiometricDevices
);

router.delete(
  '/biometric/:userId',
  authorize(['school_admin', 'super_admin']),
  advancedAttendanceController.deactivateBiometric
);

// Face Recognition Attendance
router.post(
  '/face-recognition/register',
  advancedAttendanceController.registerFace
);

router.post(
  '/face-recognition/verify',
  advancedAttendanceController.verifyFace
);

router.delete(
  '/face-recognition/:userId',
  authorize(['school_admin', 'super_admin']),
  advancedAttendanceController.deactivateFaceRecognition
);

router.get(
  '/face-recognition/statistics',
  authorize(['teacher', 'principal', 'school_admin', 'super_admin']),
  advancedAttendanceController.getFaceRecognitionStats
);

// QR Code Attendance
router.post(
  '/qr-code/generate',
  authorize(['teacher', 'principal', 'school_admin', 'super_admin']),
  advancedAttendanceController.generateAttendanceQR
);

router.post(
  '/qr-code/scan',
  advancedAttendanceController.scanAttendanceQR
);

router.post(
  '/qr-code/personal/generate/:userId?',
  advancedAttendanceController.generatePersonalQR
);

router.post(
  '/qr-code/personal/scan',
  authorize(['teacher', 'principal', 'school_admin', 'super_admin']),
  advancedAttendanceController.scanPersonalQR
);

router.get(
  '/qr-code/sessions',
  authorize(['teacher', 'principal', 'school_admin', 'super_admin']),
  advancedAttendanceController.getActiveSessions
);

router.delete(
  '/qr-code/sessions/:sessionId',
  authorize(['teacher', 'principal', 'school_admin', 'super_admin']),
  advancedAttendanceController.invalidateSession
);

router.get(
  '/qr-code/statistics',
  authorize(['teacher', 'principal', 'school_admin', 'super_admin']),
  advancedAttendanceController.getQRCodeStats
);

export default router;
