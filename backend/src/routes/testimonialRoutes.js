import express from 'express';
import * as testimonialController from '../controllers/testimonialController.js';

const router = express.Router();

router.get('/', testimonialController.default.getAllTestimonials);
router.get('/:id', testimonialController.default.getTestimonial);
router.post('/', testimonialController.default.createTestimonial);
router.put('/:id', testimonialController.default.updateTestimonial);
router.delete('/:id', testimonialController.default.deleteTestimonial);

export default router;
