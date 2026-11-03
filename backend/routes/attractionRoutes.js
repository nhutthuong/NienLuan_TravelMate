const express = require('express');
const router = express.Router();
const attractionController = require('../controllers/attractionController');
const { optionalAuth, verifyToken } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, attractionController.getAttractions);
router.get('/:id', optionalAuth, attractionController.getAttractionDetail);
router.post('/:id/reviews', verifyToken, attractionController.addReview);

module.exports = router;

