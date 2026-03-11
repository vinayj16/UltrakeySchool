import express from 'express';
import * as libraryController from '../controllers/libraryController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authGuard.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Book Management
router.post(
  '/books',
  authorize(['super_admin', 'school_admin', 'librarian']),
  libraryController.createBook
);

router.get('/books', libraryController.getBooks);

router.get('/books/:id', libraryController.getBookById);

router.put(
  '/books/:id',
  authorize(['super_admin', 'school_admin', 'librarian']),
  libraryController.updateBook
);

router.delete(
  '/books/:id',
  authorize(['super_admin', 'school_admin', 'librarian']),
  libraryController.deleteBook
);

// Issue Management
router.post(
  '/issues',
  authorize(['super_admin', 'school_admin', 'librarian']),
  libraryController.issueBook
);

router.put(
  '/issues/:id/return',
  authorize(['super_admin', 'school_admin', 'librarian']),
  libraryController.returnBook
);

router.get('/issues', libraryController.getIssues);

router.get(
  '/issues/overdue',
  authorize(['super_admin', 'school_admin', 'librarian']),
  libraryController.getOverdueIssues
);

router.put(
  '/issues/:id/pay-fine',
  libraryController.payFine
);

// Reservation Management
router.post('/reservations/:bookId', libraryController.reserveBook);

router.delete('/reservations/:id', libraryController.cancelReservation);

// Statistics
router.get(
  '/stats',
  authorize(['super_admin', 'school_admin', 'librarian']),
  libraryController.getLibraryStats
);

// Dashboard endpoints
router.get(
  '/dashboard/stats',
  authorize(['super_admin', 'school_admin', 'librarian']),
  async (req, res) => {
    try {
      const stats = await libraryController.getLibraryStats(req);
      return stats;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard stats',
        error: error.message
      });
    }
  }
);

router.get(
  '/dashboard/top-books',
  authorize(['super_admin', 'school_admin', 'librarian']),
  async (req, res) => {
    try {
      const { LibraryIssue } = await import('../models/Library.js');
      
      const topBooks = await LibraryIssue.aggregate([
        { $match: { tenant: req.user.tenant, status: 'returned' } },
        { $group: { _id: '$book', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: '_id',
            as: 'book'
          }
        },
        { $unwind: '$book' },
        {
          $project: {
            title: '$book.title',
            author: '$book.author',
            timesIssued: '$count'
          }
        }
      ]);

      return res.status(200).json({
        success: true,
        data: topBooks
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve top books',
        error: error.message
      });
    }
  }
);

router.get(
  '/dashboard/overdue',
  authorize(['super_admin', 'school_admin', 'librarian']),
  async (req, res) => {
    try {
      const { LibraryIssue, Student, Teacher } = await import('../models/Library.js');
      
      const overdueIssues = await LibraryIssue.find({
        tenant: req.user.tenant,
        status: 'issued',
        dueDate: { $lt: new Date() }
      })
      .populate('book', 'title')
      .populate('issuedTo', 'name studentId')
      .limit(5);

      const overdueData = overdueIssues.map(issue => {
        const member = issue.issuedTo;
        const dueDate = new Date(issue.dueDate);
        const today = new Date();
        const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));

        return {
          title: issue.book.title,
          memberName: member.name,
          className: member.studentId || 'Staff',
          dueDate: dueDate.toISOString().split('T')[0],
          daysOverdue
        };
      });

      return res.status(200).json({
        success: true,
        data: overdueData
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve overdue books',
        error: error.message
      });
    }
  }
);

router.get(
  '/dashboard/categories',
  authorize(['super_admin', 'school_admin', 'librarian']),
  async (req, res) => {
    try {
      const { Book } = await import('../models/Library.js');
      
      const categories = await Book.aggregate([
        { $match: { tenant: req.user.tenant } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const categoryData = categories.map(cat => ({
        category: cat._id,
        count: cat.count
      }));

      return res.status(200).json({
        success: true,
        data: categoryData
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve category data',
        error: error.message
      });
    }
  }
);

export default router;
