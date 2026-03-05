import express from 'express';
import * as noteController from '../controllers/noteController.js';
import * as validators from '../validators/noteValidators.js';

const router = express.Router();

router.post('/', validators.createNoteValidator, noteController.createNote);
router.get('/', validators.queryValidator, noteController.getAllNotes);
router.get('/statistics', noteController.getStatistics);
router.get('/by-tag', noteController.getNotesByTag);
router.get('/:id', validators.idValidator, noteController.getNoteById);
router.put('/:id', validators.updateNoteValidator, noteController.updateNote);
router.delete('/:id', validators.idValidator, noteController.deleteNote);
router.patch('/:id/toggle-important', validators.idValidator, noteController.toggleImportant);
router.patch('/:id/trash', validators.idValidator, noteController.moveToTrash);
router.patch('/:id/restore', validators.idValidator, noteController.restoreNote);
router.patch('/restore-all', noteController.restoreAllNotes);
router.delete('/:id/permanent', validators.idValidator, noteController.permanentDelete);

export default router;
