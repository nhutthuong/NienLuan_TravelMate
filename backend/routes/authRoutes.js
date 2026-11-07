const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.get('/me', verifyToken, authController.getMe);
router.put('/preferences', verifyToken, authController.updatePreferences);
router.put('/profile', verifyToken, authController.updateProfile);
router.put('/password', verifyToken, authController.changePassword);
router.post('/avatar', verifyToken, uploadAvatar.single('avatar'), authController.uploadAvatar);

module.exports = router;

