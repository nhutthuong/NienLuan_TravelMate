const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, memberController.getHistory);
router.delete('/', verifyToken, memberController.clearHistory);
router.delete('/:id', verifyToken, memberController.deleteHistory);
router.patch('/:id/note', verifyToken, memberController.updateHistoryNote);

module.exports = router;

