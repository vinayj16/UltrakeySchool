import express from 'express';
import fileManagerController from '../controllers/fileManagerController.js';
import * as validators from '../validators/fileManagerValidators.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validators.createItemValidator, fileManagerController.createItem);
router.get('/', validators.queryValidator, fileManagerController.getAllItems);
router.get('/storage', fileManagerController.getStorageInfo);
router.get('/statistics', fileManagerController.getStatistics);
router.get('/recent', fileManagerController.getRecentItems);
router.get('/search', fileManagerController.searchItems);
router.get('/:id', validators.idValidator, fileManagerController.getItemById);
router.put('/:id', validators.updateItemValidator, fileManagerController.updateItem);
router.delete('/:id', validators.idValidator, fileManagerController.deleteItem);
router.patch('/:id/trash', validators.idValidator, fileManagerController.moveToTrash);
router.patch('/:id/restore', validators.idValidator, fileManagerController.restoreItem);
router.patch('/:id/favorite', validators.idValidator, fileManagerController.toggleFavorite);
router.post('/:id/share', validators.shareValidator, fileManagerController.shareItem);
router.post('/:id/unshare', validators.shareValidator, fileManagerController.unshareItem);
router.post('/:id/move', validators.moveValidator, fileManagerController.moveItem);
router.post('/:id/copy', validators.moveValidator, fileManagerController.copyItem);

export default router;
