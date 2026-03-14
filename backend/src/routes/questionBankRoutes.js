import express from 'express';
import questionBankController from '../controllers/questionBankController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', questionBankController.createQuestion);
router.post('/bulk', questionBankController.bulkCreateQuestions);
router.get('/', questionBankController.getQuestions);
router.get('/random', questionBankController.getRandomQuestions);
router.post('/exam', questionBankController.getQuestionsForExam);
router.get('/statistics', questionBankController.getStatistics);
router.get('/subjects', questionBankController.getSubjects);
router.get('/subjects/:subject/topics', questionBankController.getTopicsBySubject);
router.get('/:questionId', questionBankController.getQuestionById);
router.put('/:questionId', questionBankController.updateQuestion);
router.delete('/:questionId', questionBankController.deleteQuestion);
router.post('/:questionId/duplicate', questionBankController.duplicateQuestion);
router.put('/:questionId/archive', questionBankController.archiveQuestion);

export default router;
