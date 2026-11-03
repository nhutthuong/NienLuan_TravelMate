const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { optionalAuth, verifyToken } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, hotelController.getHotels);
router.get('/:id', optionalAuth, hotelController.getHotelDetail);
router.post('/:id/reviews', verifyToken, hotelController.addReview);

module.exports = router;

