const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', authenticateToken, requireAdmin, bookController.addBook);
router.delete('/:id', authenticateToken, requireAdmin, bookController.deleteBook);

module.exports = router;
