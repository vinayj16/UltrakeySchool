import express from 'express';
import guardianController from '../controllers/guardianController.js';
import * as validators from '../validators/guardianValidators.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/schools/:schoolId', authenticate, validators.schoolIdValidator, validate, guardianController.getAllGuardians);

router.get('/schools/:schoolId/stats', authenticate, validators.schoolIdValidator, validate, guardianController.getGuardianStats);

router.get('/schools/:schoolId/search', authenticate, validators.searchValidator, validate, guardianController.searchGuardians);

router.get('/schools/:schoolId/permission/:permission', authenticate, validators.permissionValidator, validate, guardianController.getGuardiansWithPermission);

router.get('/schools/:schoolId/:guardianId', authenticate, validators.schoolIdValidator, validate, validators.guardianIdValidator, validate, guardianController.getGuardianById);

router.get('/schools/:schoolId/student/:studentId', authenticate, validators.schoolIdValidator, validate, validators.studentIdValidator, validate, guardianController.getGuardiansByStudentId);

router.get('/schools/:schoolId/student/:studentId/primary', authenticate, validators.schoolIdValidator, validate, validators.studentIdValidator, validate, guardianController.getPrimaryGuardian);

router.get('/schools/:schoolId/student/:studentId/emergency', authenticate, validators.schoolIdValidator, validate, validators.studentIdValidator, validate, guardianController.getEmergencyContacts);

router.post('/schools/:schoolId', authenticate, validators.createGuardianValidator, validate, guardianController.createGuardian);

router.put('/schools/:schoolId/:guardianId', authenticate, validators.updateGuardianValidator, validate, guardianController.updateGuardian);

router.delete('/schools/:schoolId/:guardianId', authenticate, validators.schoolIdValidator, validate, validators.guardianIdValidator, validate, guardianController.deleteGuardian);

router.post('/schools/:schoolId/:guardianId/children', authenticate, validators.addChildValidator, validate, guardianController.addChildToGuardian);

router.delete('/schools/:schoolId/:guardianId/children/:studentId', authenticate, validators.schoolIdValidator, validate, validators.guardianIdValidator, validate, validators.studentIdValidator, validate, guardianController.removeChildFromGuardian);

router.put('/schools/:schoolId/:guardianId/children/:studentId/relationship', authenticate, validators.schoolIdValidator, validate, validators.guardianIdValidator, validate, validators.studentIdValidator, validate, guardianController.updateChildRelationship);

router.put('/schools/:schoolId/:guardianId/permissions', authenticate, validators.updatePermissionsValidator, validate, guardianController.updateGuardianPermissions);

export default router;
