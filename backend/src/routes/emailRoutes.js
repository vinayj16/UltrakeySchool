import express from 'express';
import * as emailController from '../controllers/emailController.js';
import * as validators from '../validators/emailValidators.js';

const router = express.Router();

router.post('/', validators.createEmailValidator, emailController.createEmail);
router.get('/', validators.queryValidator, emailController.getAllEmails);
router.get('/statistics', emailController.getStatistics);
router.get('/search', emailController.searchEmails);
router.get('/recent', emailController.getRecentEmails);
router.get('/thread/:threadId', emailController.getEmailsByThread);
router.get('/:id', validators.idValidator, emailController.getEmailById);
router.put('/:id', validators.updateEmailValidator, emailController.updateEmail);
router.delete('/:id', validators.idValidator, emailController.deleteEmail);
router.post('/mark-read', validators.markAsReadValidator, emailController.markAsRead);
router.patch('/:id/star', validators.idValidator, emailController.toggleStar);
router.patch('/:id/important', validators.idValidator, emailController.toggleImportant);
router.post('/move-folder', validators.moveToFolderValidator, emailController.moveToFolder);
router.post('/send', validators.createEmailValidator, emailController.sendEmail);
router.post('/draft', validators.createEmailValidator, emailController.saveDraft);
router.post('/schedule', validators.createEmailValidator, emailController.scheduleEmail);
router.post('/:id/reply', validators.idValidator, emailController.replyToEmail);
router.post('/:id/forward', validators.idValidator, emailController.forwardEmail);
router.post('/:id/tags', validators.tagsValidator, emailController.addTags);
router.delete('/:id/tags', validators.tagsValidator, emailController.removeTags);
router.post('/:id/labels', validators.labelsValidator, emailController.addLabels);
router.delete('/:id/labels', validators.labelsValidator, emailController.removeLabels);
router.post('/bulk/delete', validators.bulkActionValidator, emailController.bulkDelete);
router.post('/bulk/permanent-delete', validators.bulkActionValidator, emailController.permanentDelete);
router.delete('/trash/empty', emailController.emptyTrash);

export default router;
