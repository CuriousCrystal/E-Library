const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

router.post('/borrow', authenticateToken, transactionController.borrowBook);
router.post('/borrow-external', authenticateToken, transactionController.borrowExternal);
router.post('/return', authenticateToken, transactionController.returnBook);

module.exports = router;
