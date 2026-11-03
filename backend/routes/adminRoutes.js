const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { uploadMedia } = require('../middleware/uploadMiddleware');

router.use(verifyToken, requireAdmin);

// Thong ke
router.get('/stats', adminController.getStats);

// Nguoi dung
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);

// Dia diem
router.post('/locations', adminController.createLocation);
router.put('/locations/:id', adminController.updateLocation);
router.delete('/locations/:id', adminController.deleteLocation);

// Diem tham quan
router.post('/attractions', adminController.createAttraction);
router.put('/attractions/:id', adminController.updateAttraction);
router.delete('/attractions/:id', adminController.deleteAttraction);

// Khach san
router.post('/hotels', adminController.createHotel);
router.put('/hotels/:id', adminController.updateHotel);
router.delete('/hotels/:id', adminController.deleteHotel);

// Danh gia
router.get('/reviews', adminController.getReviews);
router.patch('/reviews/:type/:id/status', adminController.updateReviewStatus);
router.delete('/reviews/:type/:id', adminController.deleteReview);

// Tien nghi
router.post('/amenities', adminController.createAmenity);
router.put('/amenities/:id', adminController.updateAmenity);
router.delete('/amenities/:id', adminController.deleteAmenity);

// Hoat dong
router.post('/activities', adminController.createActivity);
router.put('/activities/:id', adminController.updateActivity);
router.delete('/activities/:id', adminController.deleteActivity);

// Upload anh
router.post('/upload', uploadMedia.single('image'), adminController.uploadImage);

module.exports = router;

