import express from 'express';
import questionBankController from '../controllers/questionBankController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', questionBankController.default.createQuestion);
router.post('/bulk', questionBankController.default.bulkCreateQuestions);
router.get('/', questionBankController.default.getQuestions);
router.get('/random', questionBankController.default.getRandomQuestions);
router.post('/exam', questionBankController.default.getQuestionsForExam);
router.get('/statistics', questionBankController.default.getStatistics);
router.get('/subjects', questionBankController.default.getSubjects);
router.get('/subjects/:subject/topics', questionBankController.default.getTopicsBySubject);
router.get('/:questionId', questionBankController.default.getQuestionById);
router.put('/:questionId', questionBankController.default.updateQuestion);
router.delete('/:questionId', questionBankController.default.deleteQuestion);
router.post('/:questionId/duplicate', questionBankController.default.duplicateQuestion);
router.put('/:questionId/archive', questionBankController.default.archiveQuestion);

export default router;
