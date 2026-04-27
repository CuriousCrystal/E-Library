const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.get('/dashboard', authenticateToken, userController.getDashboard);
router.get('/favorites', authenticateToken, userController.getFavorites);
router.post('/favorites/toggle', authenticateToken, userController.toggleFavorite);

module.exports = router;
