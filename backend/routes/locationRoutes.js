const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/locations', optionalAuth, locationController.getLocations);
router.get('/locations/:id', optionalAuth, locationController.getLocationDetail);
router.get('/categories', locationController.getCategories);
router.get('/amenities', locationController.getAmenities);
router.get('/activities', locationController.getActivities);

module.exports = router;

