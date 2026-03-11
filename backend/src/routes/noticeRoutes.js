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

router.post('/', createNoticeValidator, noticeController.default.createNotice);
router.get('/', noticeController.default.getAllNotices);
router.get('/statistics', noticeController.default.getNoticeStatistics);
router.get('/search', searchValidator, noticeController.default.searchNotices);
router.get('/published', noticeController.default.getPublishedNotices);
router.get('/upcoming', noticeController.default.getUpcomingNotices);
router.get('/recipient/:recipient', recipientValidator, noticeController.default.getNoticesByRecipient);
router.get('/noticeId/:noticeId', noticeIdParamValidator, noticeController.default.getNoticeByNoticeId);
router.get('/:id', noticeIdValidator, noticeController.default.getNoticeById);
router.put('/:id', noticeIdValidator, updateNoticeValidator, noticeController.default.updateNotice);
router.delete('/:id', noticeIdValidator, noticeController.default.deleteNotice);
router.post('/bulk-delete', bulkDeleteValidator, noticeController.default.bulkDelete);
router.patch('/:id/status', noticeIdValidator, updateStatusValidator, noticeController.default.updateStatus);
router.patch('/:id/views', noticeIdValidator, noticeController.default.incrementViews);
router.post('/:id/attachments', noticeIdValidator, addAttachmentValidator, noticeController.default.addAttachment);
router.delete('/:id/attachments/:attachmentId', noticeIdValidator, attachmentIdValidator, noticeController.default.removeAttachment);

export default router;
