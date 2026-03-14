import express from 'express';
import testimonialController from '../controllers/testimonialController.js';

const router = express.Router();

router.get('/', testimonialController.getAllTestimonials);
router.get('/:id', testimonialController.getTestimonial);
router.post('/', testimonialController.createTestimonial);
router.put('/:id', testimonialController.updateTestimonial);
router.delete('/:id', testimonialController.deleteTestimonial);

export default router;
