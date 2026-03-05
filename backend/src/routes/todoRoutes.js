import express from 'express';
import * as todoController from '../controllers/todoController.js';
import * as validators from '../validators/todoValidators.js';

const router = express.Router();

router.post('/', validators.createTodoValidator, todoController.createTodo);
router.get('/', validators.queryValidator, todoController.getAllTodos);
router.get('/statistics', todoController.getStatistics);
router.get('/by-date', todoController.getTodosByDate);
router.get('/:id', validators.idValidator, todoController.getTodoById);
router.put('/:id', validators.updateTodoValidator, todoController.updateTodo);
router.delete('/:id', validators.idValidator, todoController.deleteTodo);
router.patch('/:id/toggle-complete', validators.idValidator, todoController.toggleComplete);
router.patch('/:id/toggle-important', validators.idValidator, todoController.toggleImportant);
router.patch('/:id/trash', validators.idValidator, todoController.moveToTrash);
router.patch('/:id/restore', validators.idValidator, todoController.restoreTodo);
router.delete('/:id/permanent', validators.idValidator, todoController.permanentDelete);
router.post('/bulk/delete', validators.bulkActionValidator, todoController.bulkDelete);
router.post('/bulk/mark-done', validators.bulkActionValidator, todoController.bulkMarkDone);
router.post('/bulk/mark-undone', validators.bulkActionValidator, todoController.bulkMarkUndone);

export default router;
