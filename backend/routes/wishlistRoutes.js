const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, memberController.getWishlist);
router.post('/toggle', verifyToken, memberController.toggleWishlist);
router.post('/remove', verifyToken, memberController.removeWishlist);
router.delete('/remove', verifyToken, memberController.removeWishlist);

module.exports = router;

