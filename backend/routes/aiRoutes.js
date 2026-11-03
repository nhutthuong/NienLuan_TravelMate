const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/authMiddleware');
const { uploadPredict } = require('../middleware/uploadMiddleware');

router.post('/predict', optionalAuth, uploadPredict.single('image'), aiController.predict);

module.exports = router;

