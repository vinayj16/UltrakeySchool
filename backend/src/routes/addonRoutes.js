import express from 'express';
import addonController from '../controllers/addonController.js';
const {
  getAllAddons,
  getAddonById,
  createAddon,
  updateAddon,
  deleteAddon
} = addonController;


const router = express.Router();

router.get('/', getAllAddons);
router.get('/:id', getAddonById);
router.post('/', createAddon);
router.put('/:id', updateAddon);
router.delete('/:id', deleteAddon);

export default router;
