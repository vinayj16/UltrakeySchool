import express from 'express';
import noticeController from '../controllers/noticeController.js';
const {
  createNotice,
  getNoticeById,
  getNoticeByNoticeId,
  getAllNotices,
  updateNotice,
  deleteNotice,
  bulkDelete,
  updateStatus,
  getNoticesByRecipient,
  getPublishedNotices,
  getUpcomingNotices,
  incrementViews,
  getNoticeStatistics,
  searchNotices,
  addAttachment,
  removeAttachment
} = noticeController;

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

router.post('/', createNoticeValidator, createNotice);
router.get('/', getAllNotices);
router.get('/statistics', getNoticeStatistics);
router.get('/search', searchValidator, searchNotices);
router.get('/published', getPublishedNotices);
router.get('/upcoming', getUpcomingNotices);
router.get('/recipient/:recipient', recipientValidator, getNoticesByRecipient);
router.get('/noticeId/:noticeId', noticeIdParamValidator, getNoticeByNoticeId);
router.get('/:id', noticeIdValidator, getNoticeById);
router.put('/:id', noticeIdValidator, updateNoticeValidator, updateNotice);
router.delete('/:id', noticeIdValidator, deleteNotice);
router.post('/bulk-delete', bulkDeleteValidator, bulkDelete);
router.patch('/:id/status', noticeIdValidator, updateStatusValidator, updateStatus);
router.patch('/:id/views', noticeIdValidator, incrementViews);
router.post('/:id/attachments', noticeIdValidator, addAttachmentValidator, addAttachment);
router.delete('/:id/attachments/:attachmentId', noticeIdValidator, attachmentIdValidator, removeAttachment);

export default router;
