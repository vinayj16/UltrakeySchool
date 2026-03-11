import express from 'express';
import todoController from '../controllers/todoController.js';
import * as validators from '../validators/todoValidators.js';

const router = express.Router();

router.post('/', validators.createTodoValidator, todoController.default.createTodo);
router.get('/', validators.queryValidator, todoController.default.getAllTodos);
router.get('/statistics', todoController.default.getStatistics);
router.get('/by-date', todoController.default.getTodosByDate);
router.get('/:id', validators.idValidator, todoController.default.getTodoById);
router.put('/:id', validators.updateTodoValidator, todoController.default.updateTodo);
router.delete('/:id', validators.idValidator, todoController.default.deleteTodo);
router.patch('/:id/toggle-complete', validators.idValidator, todoController.default.toggleComplete);
router.patch('/:id/toggle-important', validators.idValidator, todoController.default.toggleImportant);
router.patch('/:id/trash', validators.idValidator, todoController.default.moveToTrash);
router.patch('/:id/restore', validators.idValidator, todoController.default.restoreTodo);
router.delete('/:id/permanent', validators.idValidator, todoController.default.permanentDelete);
router.post('/bulk/delete', validators.bulkActionValidator, todoController.default.bulkDelete);
router.post('/bulk/mark-done', validators.bulkActionValidator, todoController.default.bulkMarkDone);
router.post('/bulk/mark-undone', validators.bulkActionValidator, todoController.default.bulkMarkUndone);

export default router;