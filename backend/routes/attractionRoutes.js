const express = require('express');
const router = express.Router();
const attractionController = require('../controllers/attractionController');
const { optionalAuth, verifyToken } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, attractionController.getAttractions);
router.get('/:id', optionalAuth, attractionController.getAttractionDetail);
router.post('/:id/reviews', verifyToken, attractionController.addReview);
router.put('/:id/reviews', verifyToken, attractionController.updateReview);
router.put('/:id/reviews/:reviewId', verifyToken, attractionController.updateReview);
router.delete('/:id/reviews', verifyToken, attractionController.deleteReview);
router.delete('/:id/reviews/:reviewId', verifyToken, attractionController.deleteReview);

module.exports = router;

