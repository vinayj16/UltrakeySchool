import express from 'express';
import noticeController from '../controllers/noticeController.js';

import {
  createNoticeValidator,
  updateNoticeValidator,
  noticeIdValidator,
  noticeIdParamValidator,
  recipientValidator,
  updateStatusValidator,
  bulkDeleteValidator,
  searchValidator,
  addAttachmentValidator,
  attachmentIdValidator
} from '../validators/noticeValidators.js';

const router = express.Router();

router.post('/', createNoticeValidator, noticeController.createNotice);
router.get('/', noticeController.getAllNotices);
router.get('/statistics', noticeController.getNoticeStatistics);
router.get('/search', searchValidator, noticeController.searchNotices);
router.get('/published', noticeController.getPublishedNotices);
router.get('/upcoming', noticeController.getUpcomingNotices);
router.get('/recipient/:recipient', recipientValidator, noticeController.getNoticesByRecipient);
router.get('/noticeId/:noticeId', noticeIdParamValidator, noticeController.getNoticeByNoticeId);
router.get('/:id', noticeIdValidator, noticeController.getNoticeById);
router.put('/:id', noticeIdValidator, updateNoticeValidator, noticeController.updateNotice);
router.delete('/:id', noticeIdValidator, noticeController.deleteNotice);
router.post('/bulk-delete', bulkDeleteValidator, noticeController.bulkDelete);
router.patch('/:id/status', noticeIdValidator, updateStatusValidator, noticeController.updateStatus);
router.patch('/:id/views', noticeIdValidator, noticeController.incrementViews);
router.post('/:id/attachments', noticeIdValidator, addAttachmentValidator, noticeController.addAttachment);
router.delete('/:id/attachments/:attachmentId', noticeIdValidator, attachmentIdValidator, noticeController.removeAttachment);

export default router;
