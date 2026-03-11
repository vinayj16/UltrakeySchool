import express from 'express';
import * as blogController from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Blog post routes
router.get('/posts', protect, blogController.getAllBlogs);
router.get('/posts/:id', protect, blogController.getBlog);
router.post('/posts', protect, blogController.createBlog);
router.put('/posts/:id', protect, blogController.updateBlog);
router.delete('/posts/:id', protect, blogController.deleteBlog);

// Tag routes
router.get('/tags', protect, blogController.getAllTags);
router.get('/tags/:id', protect, blogController.getTag);
router.post('/tags', protect, blogController.createTag);
router.put('/tags/:id', protect, blogController.updateTag);
router.delete('/tags/:id', protect, blogController.deleteTag);

// Comment routes
router.get('/comments', protect, blogController.getAllComments);
router.get('/comments/:blogId', protect, blogController.getBlogComments);
router.post('/comments', protect, blogController.createComment);
router.patch('/comments/:id', protect, blogController.updateComment);
router.delete('/comments/:id', protect, blogController.deleteComment);

export default router;
