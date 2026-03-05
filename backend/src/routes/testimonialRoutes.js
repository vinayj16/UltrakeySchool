import express from 'express';
import testimonialController from '../controllers/testimonialController.js';
const {
  getAllTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = testimonialController;


const router = express.Router();

router.get('/', getAllTestimonials);
router.get('/:id', getTestimonial);
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
