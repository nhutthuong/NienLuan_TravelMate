const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { optionalAuth, verifyToken } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, hotelController.getHotels);
router.get('/:id', optionalAuth, hotelController.getHotelDetail);
router.post('/:id/reviews', verifyToken, hotelController.addReview);
router.put('/:id/reviews', verifyToken, hotelController.updateReview);
router.put('/:id/reviews/:reviewId', verifyToken, hotelController.updateReview);
router.delete('/:id/reviews', verifyToken, hotelController.deleteReview);
router.delete('/:id/reviews/:reviewId', verifyToken, hotelController.deleteReview);

module.exports = router;

