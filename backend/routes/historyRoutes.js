const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, memberController.getHistory);
router.delete('/:id', verifyToken, memberController.deleteHistory);

module.exports = router;

